import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js';

export function initAuthUI(){
  onAuthStateChanged(auth, user => {
    const userEmail = document.getElementById('userEmail');
    if(userEmail) userEmail.textContent = user ? user.email : '';
  });
}

export async function login(email, password){
  return signInWithEmailAndPassword(auth, email, password);
}
export async function register(email, password){
  return createUserWithEmailAndPassword(auth, email, password);
}
export async function logout(){
  return signOut(auth);
}
