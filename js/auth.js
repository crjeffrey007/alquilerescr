// js/auth.js
// Requires firebase.js loaded
function registerWithEmail(email, password, displayName){
  return firebase.auth().createUserWithEmailAndPassword(email,password).then(cred=>{
    return firebase.firestore().collection('usuarios').doc(cred.user.uid).set({
      nombre: displayName||"",
      email: email,
      rol: "usuario",
      plan: "gratis",
      fechaRegistro: new Date().toISOString(),
      fechaExpiracion: new Date(Date.now()+30*24*60*60*1000).toISOString(),
      limitePublicaciones: 5,
      publicacionesActuales:0
    });
  });
}
function loginWithEmail(email,password){
  return firebase.auth().signInWithEmailAndPassword(email,password);
}
function logout(){
  return firebase.auth().signOut();
}
