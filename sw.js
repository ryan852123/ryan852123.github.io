// Deixa a calculadora funcionar sem internet.
// Sempre tenta a rede primeiro (para pegar atualizações) e usa a cópia guardada se estiver offline.
var V="calc-v1",ARQ=["calculadora.html","manifest.webmanifest","icone-192.png","icone-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(ARQ)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var u=new URL(e.request.url);
  if(u.origin!==location.origin||!ARQ.some(function(a){return u.pathname.endsWith(a)}))return;
  e.respondWith(fetch(e.request).then(function(r){
    var c=r.clone();caches.open(V).then(function(x){x.put(e.request,c)});return r;
  }).catch(function(){
    return caches.match(e.request,{ignoreSearch:true}).then(function(m){return m||caches.match("calculadora.html")});
  }));
});
