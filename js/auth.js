// js/auth.js
// Funciones para login/registro simple. Llamá a estas funciones desde tus botones.
const providerGoogle = new firebase.auth.GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    await firebase.auth().signInWithPopup(providerGoogle);
  } catch (err) {
    console.error(err);
    alert("Error login Google: " + err.message);
  }
}

export async function registerWithEmail(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function loginWithEmail(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
  return firebase.auth().signOut();
}

// útil: muestra uid cuando cambia estado
firebase.auth().onAuthStateChanged(user => {
  window.currentUser = user;
});
