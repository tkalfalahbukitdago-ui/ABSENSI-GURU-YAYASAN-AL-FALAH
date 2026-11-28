// Service worker: membuat aplikasi bisa dipasang (PWA) dan membuka cepat.
// Data absensi TIDAK pernah disimpan di cache; semua data selalu diambil langsung dari server.
const VERSI = 'absen-v6';
const ASET = ['./', './index.html', './style.css', './app.js', './config.js', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(ASET)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSI).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // jangan sentuh permintaan ke Apps Script
  // Ambil versi terbaru dari jaringan lebih dulu; jika offline pakai cache
  e.respondWith(
    fetch(req)
      .then((res) => {
        const salinan = res.clone();
        caches.open(VERSI).then((c) => c.put(req, salinan));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
