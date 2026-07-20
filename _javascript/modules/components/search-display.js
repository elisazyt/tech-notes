/**
 * This script makes #search-result-wrapper switch to unload or shown automatically.
 */

const content = document.querySelectorAll('#main-wrapper>.container>.row');
const search = document.getElementById('search');
const resultWrapper = document.getElementById('search-result-wrapper');
const results = document.getElementById('search-results');
const input = document.getElementById('search-input');
const hints = document.getElementById('search-hints');

// CSS class names
const UNLOADED = 'd-none';
const FOCUS = 'input-focus';

class ResultSwitch {
  static resultVisible = false;

  static on() {
    if (!this.resultVisible) {
      resultWrapper.classList.remove(UNLOADED);
      content.forEach((el) => {
        el.classList.add(UNLOADED);
      });
      this.resultVisible = true;
    }
  }

  static off() {
    if (this.resultVisible) {
      results.innerHTML = '';

      if (hints.classList.contains(UNLOADED)) {
        hints.classList.remove(UNLOADED);
      }

      resultWrapper.classList.add(UNLOADED);
      content.forEach((el) => {
        el.classList.remove(UNLOADED);
      });
      input.textContent = '';
      this.resultVisible = false;
    }
  }
}

export function displaySearch() {
  input.addEventListener('focus', () => {
    search.classList.add(FOCUS);
  });

  input.addEventListener('focusout', () => {
    search.classList.remove(FOCUS);
  });

  input.addEventListener('input', () => {
    if (input.value === '') {
      hints.classList.remove(UNLOADED);
      ResultSwitch.off();
    } else {
      hints.classList.add(UNLOADED);
      ResultSwitch.on();
    }
  });
}
