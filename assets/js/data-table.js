/**
 * Renders one or more data tables from `---`-delimited record blocks.
 *
 * Usage per table:
 *   <script type="text/plain" class="data-table-source" data-target="my-table-target"
 *           data-columns="key1:Label 1:15%|key2:Label 2:30%|key3:Label 3">
 *   ---
 *   key1: some value
 *   key2: another value
 *   key3: |
 *   - bullet one
 *   - bullet two
 *   ---
 *   </script>
 *   <div id="my-table-target"></div>
 *
 * data-columns entries are "key:label:width" (width is optional). Width can be
 * a plain number (e.g. "2"), treated as a relative ratio against the other
 * columns' numbers (they don't need to add up to anything in particular), or
 * an explicit CSS value (e.g. "40%", "8em") used as-is.
 * If data-columns is omitted, columns are inferred from the first record's keys
 * (in the order they appear), with no fixed widths.
 *
 * A field written as `key: |` starts a multi-line block: every following line
 * belongs to that field until the next `---`, or until a line shaped like
 * "key: value" whose key is one of the columns declared in data-columns (that
 * ends the block and starts the new field). A plain line inside a block stays
 * plain text; a line starting with `- ` becomes a bullet — so a block can
 * freely mix an intro line (even one with its own "label: text" shape, as
 * long as "label" isn't a real column key) with bullets underneath it.
 * Note: without data-columns, columns are inferred from the first record and
 * this disambiguation isn't possible — any "word: value"-shaped line inside a
 * block will be read as a new field, so keep multi-line blocks bullets-only
 * in that case.
 *
 * A bullet can have its own nested bullets by indenting them further than
 * their parent "- " marker, e.g.:
 *   description: |
 *   - if 2 children:
 *       - find the in-order successor
 *       - swap and delete from there
 *   - else: unlink directly
 * renders "if 2 children:" as a bullet whose <li> contains a nested <ul>
 * with its two sub-bullets, sitting alongside the sibling "else: ..." bullet.
 *
 * Rendering: a single line (with no nested children) is plain text; a block
 * of only bullets becomes a <ul>; a block mixing plain lines with bullets
 * renders the plain lines above a <ul> of the bullets. This applies
 * recursively at every nesting level.
 *
 * Within any field's text, **this** renders as bold (<strong>) — the only
 * markdown-ish syntax supported inline. Everything else (including $...$
 * math) is inserted as plain text; math gets typeset separately by MathJax
 * after the table is built (see typesetMath below).
 */
(function () {
  function parseColumns(spec) {
    if (!spec) return null;
    return spec.split('|').map(function (part) {
      var bits = part.split(':');
      return {
        key: bits[0].trim(),
        label: (bits[1] || bits[0]).trim(),
        width: bits[2] ? bits[2].trim() : null
      };
    });
  }

  function parseRecords(raw, knownKeys) {
    var lines = raw.split('\n');
    var records = [];
    var current = null;
    var descKey = null;
    var stack = null; // nesting stack for the active block: [{ indent, list }, ...]

    lines.forEach(function (line) {
      var trimmed = line.trim();
      if (trimmed === '---') {
        if (current && Object.keys(current).length) records.push(current);
        current = {};
        descKey = null;
        stack = null;
        return;
      }
      if (!current) return;

      // A line only starts a new field if it's shaped like "key: value" AND
      // (when the schema is known) its key is one of the declared columns.
      // Otherwise, while inside a block, it's just more content for that
      // block — this lets a block mix a plain intro line with "- " bullets
      // without a coincidental "word:" prefix being mistaken for a new field.
      var m = trimmed.match(/^([a-zA-Z_]+):\s*(.*)$/);
      var isNewField = !!m && (!knownKeys || knownKeys.indexOf(m[1]) !== -1);

      if (descKey && !isNewField) {
        if (trimmed === '') return;
        var indent = line.match(/^\s*/)[0].length;
        var isBullet = trimmed.indexOf('- ') === 0;
        var item = {
          bullet: isBullet,
          text: isBullet ? trimmed.slice(2) : trimmed,
          children: []
        };
        // More-indented lines nest under the nearest preceding bullet at a
        // shallower indent; pop back to that ancestor first.
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }
        stack[stack.length - 1].list.push(item);
        if (isBullet) {
          stack.push({ indent: indent, list: item.children });
        }
        return;
      }

      if (isNewField) {
        var key = m[1], val = m[2];
        if (val === '|') {
          current[key] = [];
          descKey = key;
          stack = [{ indent: -1, list: current[key] }];
        } else {
          current[key] = val;
          descKey = null;
          stack = null;
        }
      }
    });
    if (current && Object.keys(current).length) records.push(current);
    return records;
  }

  // Appends `text` into `container` as real DOM nodes, turning **bold**
  // spans into <strong> elements. Everything else stays plain text (no
  // HTML injection risk from table data — only ** is ever interpreted).
  function appendInlineText(container, text) {
    var regex = /\*\*(.+?)\*\*/g;
    var lastIndex = 0;
    var match;
    while ((match = regex.exec(text))) {
      if (match.index > lastIndex) {
        container.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      var strong = document.createElement('strong');
      strong.textContent = match[1];
      container.appendChild(strong);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      container.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  }

  function renderItems(items) {
    var frag = document.createDocumentFragment();
    var plain = items.filter(function (i) { return !i.bullet; });
    var bullets = items.filter(function (i) { return i.bullet; });

    plain.forEach(function (p) {
      var div = document.createElement('div');
      appendInlineText(div, p.text);
      frag.appendChild(div);
    });

    if (bullets.length) {
      var ul = document.createElement('ul');
      bullets.forEach(function (b) {
        var li = document.createElement('li');
        appendInlineText(li, b.text);
        if (b.children && b.children.length) {
          li.appendChild(renderItems(b.children));
        }
        ul.appendChild(li);
      });
      frag.appendChild(ul);
    }
    return frag;
  }

  function renderTable(source, target, columns) {
    var knownKeys = columns && columns.map(function (c) { return c.key; });
    var records = parseRecords(source.textContent, knownKeys);

    if (!columns) {
      var first = records[0] || {};
      columns = Object.keys(first).map(function (k) {
        return { key: k, label: k, width: null };
      });
    }

    var table = document.createElement('table');
    table.className = 'data-table';

    if (columns.some(function (c) { return c.width; })) {
      var isRatio = function (w) { return /^\d+(\.\d+)?$/.test(w); };
      var ratioSum = columns.reduce(function (sum, c) {
        return c.width && isRatio(c.width) ? sum + parseFloat(c.width) : sum;
      }, 0);

      var colgroup = document.createElement('colgroup');
      columns.forEach(function (col) {
        var c = document.createElement('col');
        if (col.width) {
          c.style.width = (isRatio(col.width) && ratioSum > 0)
            ? (parseFloat(col.width) / ratioSum * 100) + '%'
            : col.width;
        }
        colgroup.appendChild(c);
      });
      table.appendChild(colgroup);
    }

    var headRow = document.createElement('tr');
    columns.forEach(function (col) {
      var th = document.createElement('th');
      th.textContent = col.label;
      headRow.appendChild(th);
    });
    table.appendChild(headRow);

    records.forEach(function (rec) {
      var tr = document.createElement('tr');
      columns.forEach(function (col) {
        var td = document.createElement('td');
        var val = rec[col.key];
        if (Array.isArray(val)) {
          if (val.length === 0) {
            td.textContent = '-';
          } else if (val.length === 1 && !(val[0].children && val[0].children.length)) {
            appendInlineText(td, val[0].text);
          } else {
            td.appendChild(renderItems(val));
          }
        } else if (val) {
          appendInlineText(td, val);
        } else {
          td.textContent = '-';
        }
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    target.appendChild(table);
  }

  function typesetMath(targets) {
    // Tables are injected after MathJax's initial page scan, so any $...$
    // math inside them needs an explicit re-typeset pass once MathJax is ready.
    if (!targets.length || !window.MathJax) return;
    var run = function () { window.MathJax.typesetPromise(targets); };
    if (window.MathJax.startup && window.MathJax.startup.promise) {
      window.MathJax.startup.promise.then(run);
    } else if (window.MathJax.typesetPromise) {
      run();
    }
  }

  function renderAll() {
    var sources = document.querySelectorAll('script.data-table-source[type="text/plain"]');
    var targets = [];
    sources.forEach(function (source) {
      var targetId = source.getAttribute('data-target');
      var target = targetId && document.getElementById(targetId);
      if (!target) return;
      var columns = parseColumns(source.getAttribute('data-columns'));
      renderTable(source, target, columns);
      targets.push(target);
    });
    typesetMath(targets);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
})();
