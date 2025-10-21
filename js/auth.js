// auth.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const provider = new GoogleAuthProvider();
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    await signInWithPopup(auth, provider);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.classList.add("logged-in");
    localStorage.setItem("uid", user.uid);
  } else {
    document.body.classList.remove("logged-in");
    localStorage.removeItem("uid");
  }
});
