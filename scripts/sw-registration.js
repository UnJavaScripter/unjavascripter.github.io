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

    function sendSubscriptionToServer(state, subscription) {
      let subscriptionUrl = new URL(subscription.endpoint);
      const firebaseUser = firebase.auth().currentUser;
      if(firebaseUser) {
        if(state) {
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

    }

    // subscribe
    function subscribeToPushes() {
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            // UI
            var pushButton = document.querySelector('.js-push-button');
            pushButton.disabled = false;

            if (!subscription) {
              return;
            }

            // Keep your server in sync with the latest subscription
            _setSubscription(true, subscription)

              // Set your UI to show they have subscribed for
              // push messages
            pushButton.textContent = 'Disable Push Messages';
            isPushEnabled = true;
          })
          .catch(function(err) {
            window.Demo.debug.log('Error during getSubscription()', err);
          });
      });
    }

    // Unsubscription
    function unsubscribeFromPushes() {
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // To unsubscribe from push messaging, you need get the
        // subcription object, which you can call unsubscribe() on.
        serviceWorkerRegistration.pushManager.getSubscription().then(
          function(pushSubscription) {
            // UI
            if (!pushSubscription) {
              // No subscription object, so set the state
              // to allow the user to subscribe to push
              isPushEnabled = false;
              pushButton.disabled = false;
              pushButton.textContent = 'Enable Push Messages';
              return;
            }


            pushSubscription.unsubscribe().then(function() {
              pushButton.disabled = false;
              pushButton.textContent = 'Enable Push Messages';
              isPushEnabled = false;
            }).catch(function(e) {
              _setSubscription(false);
            });
          }).catch(function(e) {
            _setSubscription(false);
          });
      });
    }

    navigator.serviceWorker.addEventListener('message', function(event){
      if(event.data === 'newPush') {

        firebase.database().ref('push_data')
          .once('value')
          .then(snapshot => {
            let pushDataObj = {};
            snapshot.forEach(childSnapshot => {
              let key = childSnapshot.key;
              let val = childSnapshot.val();
              pushDataObj[key] = val;
            })
            event.ports[0].postMessage(pushDataObj);
          })
      }
    });
  }
})();