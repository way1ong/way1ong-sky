// Without internet: in the built app a service worker keeps this version's files (scripts/pwa.ts builds
// it), so the app opens offline after the first visit. Only on the app's own page, which carries the app
// manifest: not while developing, not on a test page that shows the app, not inside another site's frame.
export function isAppPage(): boolean {
  return document.querySelector('link[rel="manifest"]') !== null && window.self === window.top;
}

export function keepOffline(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || !isAppPage()) return;
  window.addEventListener('load', () => {
    // Without the worker the app still works online, so a refusal needs no message.
    navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}
