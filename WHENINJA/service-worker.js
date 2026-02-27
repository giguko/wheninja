// service-worker.js - PWA Service Worker

const CACHE_NAME = 'wheninjapan-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/main.css',
  '/scripts/storage.js',
  '/scripts/quiz.js',
  '/scripts/level.js',
  '/scripts/app.js',
  '/assets/data/quizzes.b64',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/images/cat-fuji-basic.png',
  '/assets/images/cat-fuji-happy.png',
  '/assets/images/cat-fuji-thinking.png',
  '/assets/images/cat-fuji-celebrate.png',
  '/assets/images/cat-select-fuji.png',
  '/assets/images/cat-select-mike-locked.png',
  '/assets/images/cat-select-kuro-locked.png',
  '/assets/images/cat-fuji-fullbody.png'
];

// インストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('キャッシュを開きました');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request);
      })
  );
});

// アクティベート（古いキャッシュを削除）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
