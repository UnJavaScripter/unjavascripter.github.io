let provider = new firebase.auth.GoogleAuthProvider();

provider.addScope('profile');
provider.addScope('email');
provider.addScope('openid');

function auth_login() {
  firebase.auth().signInWithRedirect(provider);
}

firebase.auth().getRedirectResult().then(function(result) {
  console.log(result);
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log(user);
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
    tostada.mostrar(`¡Hola ${user.displayName}!`)
  } else {
    tostada.mostrar(`¿Sabías que puedes registrarte?`, {tiempo: 6000})
  }
});

function auth_logout() {
  firebase.auth().signOut().then(function() {
    tostada.mostrar('Sesión cerrada satisfactoriamente');
  }).catch(function(error) {
    tostada.mostrar('Hmmm, algo pasó y no se pudo cerrar la sesión');
  });
}