// 앱을 홈 화면에 설치했을 때 오프라인에서도 기본 화면(앱 셸)이 뜨도록
// 최소한의 정적 파일만 캐싱한다. 지도 타일처럼 계속 바뀌는 외부 리소스는
// 캐싱하지 않고 네트워크로 그대로 흘려보낸다.
const CACHE_NAME = 'map-divider-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {}) // 오프라인/네트워크 문제로 일부 캐싱 실패해도 설치 자체는 진행
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 같은 출처(앱 셸 파일)만 캐시 우선으로 처리하고,
  // Leaflet CDN / OSM 타일 등 다른 출처 요청은 서비스워커가 관여하지 않는다.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
