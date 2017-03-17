let provider = new firebase.auth.GoogleAuthProvider();
const iniciarSesion_btn = document.querySelector('.iniciar-sesion');
const cerrarSesion_btn = document.querySelector('.cerrar-sesion');

function auth_login() {
  provider.addScope('profile');
  provider.addScope('email');
  provider.addScope('openid');
  firebase.auth().signInWithRedirect(provider);
}

firebase.auth().getRedirectResult().then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  //var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  hideElem(iniciarSesion_btn);
  showElem(cerrarSesion_btn);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  console.log(error);
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    hideElem(iniciarSesion_btn);
    showElem(cerrarSesion_btn);
    tostada.mostrar(`¡Hola ${user.displayName}!`)
  } else {
    showElem(iniciarSesion_btn);
    hideElem(cerrarSesion_btn);
    // tostada.mostrar(`¿Sabías que puedes registrarte?`, {tiempo: 6000})
  }
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