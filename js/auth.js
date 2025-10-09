// js/auth.js
import { auth, googleProvider, facebookProvider, githubProvider } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const loginGoogle = document.getElementById("login-google");
if (loginGoogle) {
  loginGoogle.addEventListener("click", () => signInWithPopup(auth, googleProvider));
}

onAuthStateChanged(auth, user => {
  if (user) {
    document.body.classList.add("auth");
    console.log("Usuario conectado:", user.email);
  } else {
    document.body.classList.remove("auth");
  }
});

document.getElementById("logout")?.addEventListener("click", () => signOut(auth));
