// Guarda la app en el celular para que abra SIN internet.
// Si cambias index.html, sube el número de VERSION para que los celulares bajen la nueva.
const VERSION = "potreros-v4";
const ARCHIVOS = ["./", "./index.html", "./manifest.json", "./icon.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Primero lo guardado (rápido y sin señal); en segundo plano revisa si hay versión nueva.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(g => {
    const red = fetch(e.request).then(r => { if (r && r.ok) caches.open(VERSION).then(c => c.put(e.request, r.clone())); return r; }).catch(() => g || caches.match("./index.html"));
    return g || red;
  }));
});
