let CACHE_ACTUAL = 'cache2';
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

// Instalación del service worker y cacheo inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_ACTUAL)
      .then((cache) => {
        return cache.addAll(archivos_para_cachear).then(() => {
          console.log('Archivos cacheados');
        });
      })
      .then(_ => self.skipWaiting())
  );
});

// El service worker actual tomó control
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());

  event.waitUntil(
    caches.keys().then(lasCachesQueExisten => {

      return Promise.all(
        lasCachesQueExisten.map(unaCache => {
          if (unaCache !== CACHE_ACTUAL) {
            return caches.delete(unaCache).then(() => {
              console.log('Cachés previas eliminadas');
            });
          }
        })
      );

    })
  );
});

// Interceptor de solicitudes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((respuestaEnCache) => {
        const laSolicitud = event.request.clone();

        return fetch(laSolicitud).then((respuestaDeLaRed) => {

            if(!respuestaDeLaRed
              || respuestaDeLaRed.status !== 200 
              || respuestaDeLaRed.type !== 'basic'
              || (/(google-analytics.com)|(fonts.googleapis.com)/gi).test(laSolicitud.url)
            ){
              return respuestaDeLaRed;
            }

            const respuestaDeLaRedParaCachear = respuestaDeLaRed.clone();

            caches.open(CACHE_ACTUAL)
              .then((cache) => {
                cache.put(event.request, respuestaDeLaRedParaCachear);
              });

            return respuestaDeLaRed;
          }
        ).catch(err => {
          if(requestUrl.startsWith('https://pbs.twimg.com/profile_images/') && requestUrl.endsWith('?')){
            return cache.match('/assets/img/me.jpg')
          }
          return respuestaEnCache;
        });
      })
    );
});

// Notificaciones Push
self.addEventListener('push', function(event) {  
  var title = 'Jojojo';  
  var body = '¡Un mensaje Push ha llegado!';  
  var icon = '/apple-touch-icon.png';  
  var tag = 'jojojojojo-push-tag';

  event.waitUntil(  
    self.registration.showNotification(title, {  
      body: body,  
      icon: icon,  
      tag: tag  
    })  
  );  
});