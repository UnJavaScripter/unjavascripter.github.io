---
published: false
layout: post
title:  "Service Worker"
date:   2016-07-22 23:33:10
categories: general
lvl: 2
comments: true
description: "Aplicaciones offline con JavaScript"
---

Service Worker es la tecnología de moda. Nos permite hacer que nuestras aplicaciones puedan funcionar _offline_ === sin Intenet.

Como si eso no fuera poco, a través del service worker (**en adelante SW**) podemos recibir notificaciones push y background sync == actualizaciones en segundo plano. Estos dos últimos temas los cubriremos en el futuro, en este post vamos a ver las bases del funcionamiento del SW y algo de _offline_.

## Registrando un SW

```js

// Script que se ejecuta durante la carga de la aplicación

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(registration => {
    console.log('Service worker registrado :D');
  }).catch(err => {
    console.warn(':( Algo pasó: ', err);
  });
}
```

1. Primero validamos que el navegador soporte SW
1. A continuación invocamos el método register indicando la ruta del archivo del SW (este debe estar al mismo nivel de index.html, en la raíz de nuestra app para que tenga acceso a todos los archivos), este método devuelve una promesa
1. Después creamos los callbacks de éxito y error de la promesa

## Instalación del SW

Tras un registro exitoso inicia el proceso de instalación

```js

// sw.js

const MI_CACHE = 'cache-de-mi-app-1'; // El nombre de la cache que vamos a usar. Estoy definiendo la variable MI_CACHE con 'const' en lugar de 'var' ya que es una constante 
const archivos_para_cachear = [ // Array de las urls de los archivos que quiero guardar en cache
  '/',
  '/css/main.css'
];

self.addEventListener('install', event => { // self es lo mismo que 'this'
  
  event.waitUntil( // Recibe una promesa y actúa dependiendo de su resolución
    caches.open(MI_CACHE) // ... Es claro qué hace
      .then(cache => {
        return cache.addAll(archivos_para_cachear); // Una vez se abre la cache se agregan a ella todos los archivos especificados
      })
  ).then(() => {
    return self.skipWaiting(); // El SW pasa de estado 'instalando' a 'activado'
  });

});

// ...

```