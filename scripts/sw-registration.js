"use strict";

(function(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(registration => {
      console.log('Service worker registrado :D');
    }).catch(err => {
      console.warn(':( Algo pasó: ', err);
    });
  }
})();