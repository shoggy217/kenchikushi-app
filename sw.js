const CACHE = "kenchikushi-v28";
const ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = e.request.url;
  // GET以外(POST等)は一切キャッシュせず素通し（AI呼び出し等が壊れないように）
  if (e.request.method !== "GET") return;
  // 外部ドメイン（Supabase Edge Function・API等）もSWは介入しない
  if (!url.startsWith(self.location.origin)) return;
  // 問題データ(.json)は常に最新を取りに行く（network-first）。更新が即反映されるように。
  if (url.endsWith(".json")) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok && url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))  // オフライン時のみキャッシュにフォールバック
    );
    return;
  }
  // それ以外（HTML/画像等）はキャッシュ優先
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // 画像リクエストにindex.htmlを返さない（表示崩れ防止）。ナビゲーションのみHTMLへ
        if (e.request.mode === "navigate") return caches.match("/index.html");
        return new Response("", { status: 504 });
      });
    })
  );
});
