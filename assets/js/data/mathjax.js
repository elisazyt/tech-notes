---
layout: compress
# WARNING: Don't use '//' to comment out code, use '{% comment %}' and '{% endcomment %}' instead.
---

{%- comment -%}
  See: <https://docs.mathjax.org/en/latest/options/input/tex.html#tex-options>
{%- endcomment -%}

MathJax = {
  tex: {
    {%- comment -%} start/end delimiter pairs for in-line math {%- endcomment -%}
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    {%- comment -%} start/end delimiter pairs for display math {%- endcomment -%}
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]']
    ],
    {%- comment -%} equation numbering {%- endcomment -%}
    tags: 'ams'
  },
  output: {
    {%- comment -%} scroll long display equations instead of overflowing the page {%- endcomment -%}
    displayOverflow: 'scroll'
  },
  options: {
    {%- comment -%} default skip list is ['script','noscript','style','textarea','pre','code','annotation','annotation-xml'];
      drop 'pre' so raw <pre> pseudocode blocks with inline $...$ math still get scanned.
      'code' stays skipped so syntax-highlighted <pre><code> blocks (which may contain literal $ in code) are untouched. {%- endcomment -%}
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'code', 'annotation', 'annotation-xml']
  }
};
