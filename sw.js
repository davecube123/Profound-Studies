/* Service worker: makes the whole study space work offline.
   Strategy: precache everything, then stale-while-revalidate, so pages open
   instantly and quietly pick up any changes you push.
   Bump VERSION when files are added or removed. */
const VERSION = 'ps-v3';
const FILES = [
  './', 'index.html', 'map.html', 'manifest.webmanifest',
  'app/app.css', 'app/app.js', 'app/md.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'README.md', 'THE_THREAD.md', 'questions.md',
  '01-recursion/README.md', '01-recursion/quicksort.html',
  '02-emergence/README.md', '02-emergence/life.html',
  '03-primes/README.md', '03-primes/twin-primes.html', '03-primes/twin_primes.py',
  '04-randomness/README.md', '04-randomness/miller_rabin.py',
  '05-self-reference/README.md', '05-self-reference/diagonal.html', '05-self-reference/quine.py',
  '06-complexity/README.md',
  'puzzles/puzzles.md',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    const res = await network;
    if (res) return res;
    if (req.mode === 'navigate') return cache.match('index.html');
    return new Response('Offline and not cached yet.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(list => {
    for (const c of list) if ('focus' in c) { c.navigate && c.navigate('index.html#/focus'); return c.focus(); }
    return self.clients.openWindow('index.html#/focus');
  }));
});
