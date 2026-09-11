// Service worker do RotaLeve — faz o app abrir rápido e a interface funcionar offline.
const CACHE = "rotaleve-v2";

// Arquivos da "casca" do app (a interface). NÃO inclui as APIs de rota/altitude,
// que sempre precisam de internet.
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
];

// Hosts que dependem de internet ao vivo — deixamos o navegador buscar normalmente.
const LIVE = [
  "nominatim.openstreetmap.org",
  "router.project-osrm.org",
  "api.open-meteo.com",
  "tile.openstreetmap.org",
  "api.mapbox.com",
  "overpass-api.de",
  "script.google.com"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (LIVE.some((h) => url.hostname.includes(h))) return; // rede direta

  // A PÁGINA (index.html / navegação): rede primeiro, para sempre pegar a versão
  // mais nova; cache só como reserva quando estiver offline.
  const isDoc = req.mode === "navigate" ||
    url.pathname.endsWith("/") || url.pathname.endsWith("index.html");
  if (isDoc) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // Demais arquivos da casca (ícones, Leaflet): cache primeiro (mudam pouco).
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      });
    })
  );
});
