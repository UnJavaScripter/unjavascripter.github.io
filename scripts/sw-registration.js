"use strict";

(function(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(registration => {
      registration.onupdatefound = function() {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (!navigator.serviceWorker.controller) {
                tostada.mostrar('Sitio \'cacheado\' ¡Visitas offline activadas!');
              }
              break;

            case 'redundant':
              console.error('La instalación se volvió redundante')
          }
        };
      };
    }).catch(err => {
      console.warn(':( Algo pasó durante el registro del Service Worker: ', err);
    });
  }
})();