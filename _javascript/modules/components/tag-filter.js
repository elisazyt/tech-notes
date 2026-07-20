/**
 * Filters the sidebar's alphabetical tag list as the user types.
 */

const UNLOADED = 'd-none';

export function initTagFilter() {
  const input = document.getElementById('tag-filter-input');

  if (!input) {
    return;
  }

  const tagItems = document.querySelectorAll('#tag-filter-list > li');
  const emptyMsg = document.querySelector('.sidebar-tags-empty');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    tagItems.forEach((item) => {
      const isMatch = item.dataset.tagName.includes(query);
      item.classList.toggle(UNLOADED, !isMatch);

      if (isMatch) {
        visibleCount += 1;
      }
    });

    emptyMsg.classList.toggle(UNLOADED, visibleCount > 0);
  });
}
