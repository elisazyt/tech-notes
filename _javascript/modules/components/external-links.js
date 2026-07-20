/**
 * Open content links in a new tab
 */

export function newTabLinks() {
  document.querySelectorAll('.content a[href]').forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}
