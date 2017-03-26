let notificationRedirectUrl = '';
let CACHE_ACTUAL = 'cache1';
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
              self.skipWaiting();
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
self.addEventListener('push', event =>  {  
  event.waitUntil(
    // Traemos de un API remota la información que vamos a asigar a esta notificación
    fetch('https://blog-diegocoy.firebaseio.com/push_data.json').then(response => {
      return response.json()
        .then(pushData => {
          return self.registration.showNotification(pushData.title, {  
            body: pushData.body || '¡Un mensaje Push ha llegado!',
            icon: pushData.icon || '/logo_192.png',
            tag: pushData.tag || 'push-tag',
            actions: [
              {action: pushData.action, title: 'Leer 🕮'}
            ],
            data: pushData.action_data
          });
        })
      })
  )
});

// Lo que pasará al hacer clic sobre la notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'href') {  
    clients.openWindow(event.notification.data);  
  }

})
