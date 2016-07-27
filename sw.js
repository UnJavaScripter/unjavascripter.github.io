let CACHE_ACTUAL = 'cache0';
let archivos_para_cachear = [
  '/',
  '/?o=i',
  '/manifest.json',
  '/stylesheets/main.css',

  '/scripts/app.js',
  '/scripts/tostada.js',

  '/assets/img/me.jpg',
  '/assets/img/ball-bkg.png',

  '/about/',
  
  '/angular1.x/Angular1.x-Intro.html',
  '/angular1.x/Lista-de-Cosas-Por-Hacer.html',
  
  '/general/hello-world.html',
  '/general/Markdown.html',
  '/general/Service-worker.html',
  '/general/Web-app-manifest.html',

  '/nodejs/crawler-descarga-contenido.html',

  '/typescript/typescript-intro.html'


];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_ACTUAL).then(cache => {
      
      return cache.addAll(archivos_para_cachear)
        .then(_ => {
          self.skipWaiting();
        });
    })
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());

  event.waitUntil(
    caches.keys().then(cacheNames => {

      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHE_ACTUAL !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );

    })
  );
});


self.addEventListener('fetch', event => {

  event.respondWith(
    caches.open(CACHE_ACTUAL).then(cache => {
      return fetch(event.request).then(fetchResponse => {

        if(event.request.method === 'GET'){
          cache.put(event.request, fetchResponse.clone());
        }
        return fetchResponse;
      }).catch( _ => {
        let requestUrl = event.request.url;

        if(requestUrl.startsWith('https://pbs.twimg.com/profile_images/') && requestUrl.endsWith('?')){
          return cache.match('/assets/img/me.jpg')
        }
        return cache.match(event.request).then(cacheResponse => cacheResponse);

      })

    })

  );

});
