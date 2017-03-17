const provider = new firebase.auth.GoogleAuthProvider();
const iniciarSesion_btn = document.querySelector('.session-in');
const cerrarSesion_btn = document.querySelector('.session-out');

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
      tostada.mostrar(`¡Hola ${user.displayName}!`)
    } else {
      showElem(iniciarSesion_btn);
      hideElem(cerrarSesion_btn);
      // tostada.mostrar(`¿Sabías que puedes registrarte?`, {tiempo: 6000})
    }
  });
}).catch(function(error) {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  // The email of the user's account used.
  let email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  let credential = error.credential;
  // ...
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