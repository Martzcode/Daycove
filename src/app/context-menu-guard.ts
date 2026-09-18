export function installContextMenuGuard(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
}