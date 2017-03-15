"use strict";

(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(registration => {
      registration.onupdatefound = function () {

        const installingWorker = registration.installing;

        installingWorker.onstatechange = (e) => {

          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              tostada.mostrar('El contenido del sitio se ha actualizado, verás la nueva versión tras refrescar la página');
            } else {
              tostada.mostrar('Sitio \'cacheado\' ¡Visitas offline activadas!');
            }
          }

        };
      };
    }).catch(err => {
      console.warn(':( Algo pasó durante el registro del Service Worker: ', err);
    });
  }
})();