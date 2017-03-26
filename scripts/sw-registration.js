"use strict";

(function () {
  if ('serviceWorker' in navigator) {
    const enablePushes_btn = document.querySelector('.push-button-enable');
    const disablePushes_btn = document.querySelector('.push-button-disable');
    const firebaseAuth = firebase.auth();

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

    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      if(firebaseAuth) {
        updateSubscriptionUI(serviceWorkerRegistration);
      }
    })

    function updateSubscriptionUI(registration) {
      registration.pushManager.getSubscription().then(pushSubscription => {
        console.log(pushSubscription);
        if(pushSubscription) {
          disablePushes_btn.hidden = false;
          enablePushes_btn.hidden = true;
          return;
        }
        enablePushes_btn.hidden = false;
        disablePushes_btn.hidden = true;
      })
    }

    function sendSubscriptionToServer(state, subscription, registration) {
      const firebaseUser = firebaseAuth.currentUser;
      if(firebaseUser) {
        if(state) {
          const subscriptionUrl = new URL(subscription.endpoint);
          firebase.database().ref('users/' + firebaseUser.uid).update({
            pushId: subscriptionUrl.pathname,
            active: true
          });
        }else {
          firebase.database().ref('users/' + firebaseUser.uid).update({
            pushId: '',
            active: false
          });
        }
      }
      updateSubscriptionUI(registration);
    }

    window.subscribeToPushes = function () {
      navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            console.log(subscription);
            if(!subscription) {
              serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then(subscription => {
                sendSubscriptionToServer(true, subscription, serviceWorkerRegistration);
                tostada.mostrar('¡Te enviaré una notificación cuando haga un nuevo post!');
              })
              .catch(err => {
                tostada.mostrar('Hmm no aceptaste recibir notificaciones... Ok');
              })
            }
          })
          .catch(function(err) {
            console.log('Error durante la suscripción');
          });
      });
    }

    window.unsubscribeFromPushes = function () {
      navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
        serviceWorkerRegistration.pushManager.getSubscription().then(
          pushSubscription => {
            pushSubscription.unsubscribe().then(_ => {
              tostada.mostrar('Suscripción cancelada :/');
              sendSubscriptionToServer(false, null, serviceWorkerRegistration);
            }).catch(e => {
              sendSubscriptionToServer(false, null, serviceWorkerRegistration);
            });
          }).catch(e => {
            sendSubscriptionToServer(false, null, serviceWorkerRegistration);
          });
      });
    }

}

})();