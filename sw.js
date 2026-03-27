const CACHE = 'spiritual-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  // Firebase 요청은 캐시하지 않음
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
