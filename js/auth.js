// js/auth.js - helpers de autenticación (importa firebase.js)
import { auth, googleProvider } from './firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { db } from './firebase.js';

export function initAuth(onChange){ onAuthStateChanged(auth, async user => { if(user){ try{ await setDoc(doc(db,'usuarios',user.uid), { email: user.email, name: user.displayName || '', uid: user.uid }, { merge: true }); }catch(e){} } onChange && onChange(user); }); }
export async function loginWithGoogle(){ await signInWithPopup(auth, googleProvider); }
export async function logout(){ await signOut(auth); }
