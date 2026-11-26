const C='gbp-v10';
const ASSETS=["./", "index.html", "icon.svg", "manifest.webmanifest", "bird.html", "candy.html", "car.html", "card.html", "chess.html", "fruit.html", "reaction.html", "ludo.html", "ship.html", "tic.html", "snake.html", "gb.css", "gb.js", "gbh.css", "gbh.js", "gbk.css", "gbk.js", "brick.html", "stack.html", "runner.html", "bubble.html", "2048.html"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(m=>{const n=fetch(e.request).then(r=>{if(r.ok||r.type==='opaque'){const k=r.clone();caches.open(C).then(c=>c.put(e.request,k))}return r}).catch(()=>m);return m||n}))});
