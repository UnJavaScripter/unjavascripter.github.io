---
published: true
layout: post
title:  "Service Worker"
date:   2016-07-25 23:33:10
categories: general
lvl: 2
comments: true
description: "Aplicaciones offline con JavaScript"
---

Service Worker es la tecnología de moda, nos permite hacer que nuestras aplicaciones puedan funcionar _offline_ === sin estar conectadas a Intenet.

Service worker es un proceso que corre en un thread/hilo diferente al principal, por lo tanto no tiene acceso al DOM. Sin embarno nos podemos comunicar con él a través del envío de mensajes.

Es importante mencionar que únicamente se ejecutará si la aplicación es servida desde HTTPS. Podemos usar [GitHub Pages](https://pages.github.com/){:rel="noopener"} o [Firebase hosting](https://firebase.google.com/docs/hosting/){:rel="noopener"} que son gratuitos y sirven archivos usando HTTPS. 

### Soporte

A la fecha los navegadores que soportan service worker son:

- Chrome
- Chrome mobile
- Firefox
- Opera 
- Android browser

Esto con base en lo que dice [caniuse](http://caniuse.com/#search=service%20worker){:rel="noopener"}. Para más información en el estado de los avances de cada navegador visita [isserviceworkerready](https://jakearchibald.github.io/isserviceworkerready/){:rel="noopener"}



Como si eso no fuera suficiente, a través del service worker (**en adelante SW**) podemos recibir _notificaciones push_ y _background sync_ (actualizaciones en segundo plano). Pero estos dos últimos temas los cubriremos en el futuro, en este post vamos a ver las bases del funcionamiento del SW y algo de _offline_.


## Registrando un SW

```js

// Script que se ejecuta durante la carga de la aplicación

if ('serviceWorker' in navigator) {                                   // Primero validamos que el navegador soporte SW

  navigator.serviceWorker.register('/sw.js').then(registration => {   // A continuación invocamos el método register indicando la ruta del archivo del SW
                                                                      // Debe estar al mismo nivel de index.html,
                                                                      //   en la raíz de nuestra app para que tenga acceso a todos los archivos
    console.log('Service worker registrado :D');
  }).catch(err => {
    console.warn(':( Algo pasó: ', err);
  });
}
```

## Instalación del SW

Tras un registro exitoso inicia el proceso de instalación

```js

// sw.js

const MI_CACHE = 'cache-de-mi-app-1'; // El nombre de la caché que vamos a usar. 
const archivos_para_cachear = [       // Array de las urls de los archivos que quiero guardar en caché
  '/',                                
  '/css/main.css',                                        
  '/blog/post.html',                  
  '/assets/img/foto.png'
];

self.addEventListener('install', event => {         // self es lo mismo que 'this'
  
  event.waitUntil(                                  // Recibe una promesa y actúa dependiendo de su resolución
    caches.open(MI_CACHE)                           // ... Es claro qué hace
      .then(cache => {
        return cache.addAll(archivos_para_cachear); // Una vez se abre la caché se agregan a ella todos los archivos especificados
      })
  ).then(() => {
    return self.skipWaiting();                      // El SW pasa de estado 'instalando' a 'activado'
  });

});

// ...

```

Vale mencionar que en `archivos_para_cachear`, si alguna ruta falla (está mal escrita o el archivo ya no se encuentra allí), todo el proceso de 'cacheo' posterior fallará. Es importante entonces estar seguros de que las rutas apunten a un archivo real.

Después del proceso de instalación, sigue la activación.


## Activación del SW

Vamos a mantener una única caché, la más reciente:

```js

// sw.js

// ...

 self.addEventListener('activate', event => {   // Escuchamos al evento 'activate'
  event.waitUntil(self.clients.claim());        // El SW se registra como el worker activo para el cliente actual 

  event.waitUntil(
    caches.keys().then(cacheNames => {          // Toma las caches existentes

      return Promise.all(
        cacheNames.map(cacheName => {           // Recorremos las caches exitentes
          if (CACHE_ACTUAL !== cacheName) {     // Si la caché del recorrido no es la caché actual...  
            return caches.delete(cacheName);    // La borramos, así conservamos únicamente la más reciente
          }
        })
      );

    })
  );
});

```

Con esto nos aseguramos de que siempre estaremos trabajando con los archivos más recientes.

Ahora sólo nos queda interceptar peticiones y redireccionarlas de ser necesario:


## Interceptando solicitudes HTTP

Con service worker podemos utilizar diferentes tipos de estrategia para 'cachear' archivos, como por ejemplo:

 - Tener varias caché con las últimas dos versiones de nuestro sitio
 - _cachear_ únicamente imagenes y nunca volver a solicitarlas de Internet
 - No guardar archivos en caché
 - Tener una única caché que en cada visita actualice todos los archivos de nuestra aplicación o sitio web.
 
 Nuestra imaginación es el límite ya que tenemos total control sobre lo que se guarda y lo que se toma de la caché (a diferencia de tecnologías como appcache) y todo usando JavaScript. En este caso vamos a implementar la última estrategia de la lista:


```js


self.addEventListener('fetch', event => {                   // Escuchamos al evento 'fetch',
                                                            //  este se ejecuta siempre que se hace una solicitud HTTP (se pide o envía algo por Internet)
  event.respondWith(
    caches.open(CACHE_ACTUAL).then(cache => {               // Abrimos la caché (en este momento ya contiene los archivos que decidimos cachear)
      return fetch(event.request).then(fetchResponse => {   // event.request es la solicitud al recurso. Contiene la URL y el método utilizado

        if(event.request.method === 'GET'){                 // Si el método es GET, quiere decir que estamos intentando traer datos,   
          cache.put(event.request, fetchResponse.clone());  //entonces interceptamos la respuesta y la agregamos a CACHE_ACTUAL
        }

        return fetchResponse;                     // Después dejamos que la solicitud siga su curso

      }).catch( _ => {                            // .catch se ejecutará cuando no se pueda hacer un 'fetch', en otras palabras,
                                                  //   cuando no se pueda completar una solicitud HTTP a Internet (offline)

        return cache.match(event.request)         // cache.match intenterá encontrar un archivo que cumpla con las características del recurso solicitado
          .then(cacheResponse => cacheResponse);  // Y después enviamos ese archivo encontrado en caché como respuesta.

      })

    })

  );

});

```

¡Y eso es todo!

Si visitamos nuestra aplicación y ponemos nuestro navegador (Chrome) en modo offline:

![](https://cloud.githubusercontent.com/assets/7959823/17126063/30bda3a6-52bf-11e6-881c-52964d4ab49c.png)

Al actualizar la página la aplicación sigue funcionando.

> Si no usas Chrome lo más probable es que debas suspender la conexión a Internet por otros medios

Este blog implementa la misma configuración de cacheo de archivos en el service worker, puedes probar aquí mismo.



## PWA

> Este es mi segundo artículo de la serie de publicaciones relacionadas con PWA o Progressive Web Apps (Aplicaciones Web Progresivas).
Aquí puedes leer el anterior: ["Web App Manifest"](/general/Web-app-manifest.html)


