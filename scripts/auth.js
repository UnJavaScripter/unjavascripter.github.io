const provider = new firebase.auth.GoogleAuthProvider();
const iniciarSesion_btn = document.querySelector('.session-in');
const cerrarSesion_btn = document.querySelector('.session-out');

const enablePushes_btn = document.querySelector('.push-button-enable');
const disablePushes_btn = document.querySelector('.push-button-disable');

function auth_login() {
  provider.addScope('profile');
  provider.addScope('email');
  provider.addScope('openid');
  firebase.auth().signInWithRedirect(provider);
}

firebase.auth().getRedirectResult().then(function(result) {
  
  if(result.user) {
    storeUserData(result.user);
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      hideElem(iniciarSesion_btn);
      showElem(cerrarSesion_btn);
      tostada.mostrar(`¡Hola ${user.displayName}!`);
      window.updateSubscriptionUI();
    } else {
      showElem(iniciarSesion_btn);
      hideElem(cerrarSesion_btn);
      enablePushes_btn.hidden = true;
      disablePushes_btn.hidden = true;
      // tostada.mostrar(`¿Sabías que puedes registrarte?`, {tiempo: 6000})
    }
  });
}).catch(function(error) {
  console.log(error);
});


function auth_logout() {
  firebase.auth().signOut().then(function() {
    tostada.mostrar('Sesión cerrada satisfactoriamente');
  }).catch(function(error) {
    tostada.mostrar('Hmmm, algo pasó y no se pudo cerrar la sesión');
  });
}

function hideElem(elem) {
  elem.classList.remove('displayed');
}

function showElem(elem) {
  elem.classList.add('displayed');
}

function storeUserData(data) {
  firebase.database().ref('users/' + data.uid).set({
    username: data.displayName,
    email: data.email,
    profilePicture: data.photoURL,
    providerData: data.providerData
  });
}