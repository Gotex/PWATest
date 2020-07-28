const CACHE_NAME = 'static-cache-v1';
const FILES_TO_CACHE = [
  './',
  'index.html',
  'offline.html',
  'css/style.css',
  'js/app.js',
  'js/buildCourse.js',
  'js/index.js',
  'js/adventure.js',
  'js/minigolf.js',
  'pages/adventure.html',
  'pages/minigolf.html',
  'img/golf-ball.png'
];

self.addEventListener('install', function(event) {
// Precache static resources here.
event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', function(event) {
  // Remove previous cached data from disk.
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Add fetch event handler here.
  if (event.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  event.respondWith(
      fetch(event.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match(event.request)
                    .catch((cache) =>{
                      return cache.match('offline.html');
                    });
                });
          })
  );
});