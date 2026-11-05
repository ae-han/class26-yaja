'use strict';
var CACHE = 'class26-yaja-board-shell-v3';
var BOARD = new URL('./board.html', self.location.href).href;
self.addEventListener('install', function(event) {
 event.waitUntil(caches.open(CACHE).then(function(cache) {return cache.add(BOARD);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate', function(event) {
 event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k.indexOf('class26-yaja-board-shell-')===0 && k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch', function(event) {
 var url=new URL(event.request.url);
 // Only the dedicated board shell is cached. Application writes and data requests stay untouched.
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname!==new URL(BOARD).pathname)return;
 event.respondWith(caches.open(CACHE).then(function(cache){
  var update=fetch(BOARD,{cache:'no-cache'}).then(function(response){if(response.ok) return cache.put(BOARD,response.clone()).then(function(){return response;});throw new Error('unavailable');});
  event.waitUntil(update.catch(function(){}));
  return cache.match(BOARD).then(function(saved){return saved||update;});
 }));
});
