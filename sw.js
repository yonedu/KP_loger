const V='kplogger-v1.2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='kptiles').map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// ネットにつながるときは常に最新を取得し、圏外のときだけ保存済みを使う
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  if(e.request.url.indexOf('cyberjapandata.gsi.go.jp')>=0){e.respondWith(caches.open('kptiles').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{c.put(e.request,res.clone());return res;}))));return;}
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));return res;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));});
