// js/firebase.js - reemplaza REPLACE_* con tu configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "REPLACE_API_KEY",
  authDomain: "REPLACE_PROJECT.firebaseapp.com",
  projectId: "REPLACE_PROJECT_ID",
  storageBucket: "REPLACE_PROJECT.appspot.com",
  messagingSenderId: "REPLACE_MESSAGING",
  appId: "REPLACE_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();