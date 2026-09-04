const CACHE_NAME = "clima-app-v2";

const ARQUIVOS_PARA_CACHE = {
  "name": "Consulta do Clima",
  "short_name": "Clima",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1f5c99",
  "icons": [
    {
      "src": "icons/192x192_rel.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}

// Guarda os arquivos no cache assim que o Service Worker é instalado
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_PARA_CACHE);
    })
  );
});

// Intercepta cada requisição da página
self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respostaCache) => {
      return respostaCache || fetch(evento.request);
    })
  );
});