export function installZoomGuard(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  window.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  for (const type of ['gesturestart', 'gesturechange', 'gestureend'] as const) {
    document.addEventListener(
      type,
      (event) => {
        event.preventDefault();
      },
      { passive: false }
    );
  }

  document.addEventListener(
    'touchmove',
    (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
}