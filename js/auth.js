import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const mensaje = document.getElementById("mensaje");

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    mensaje.innerText = "Acceso correcto";
    window.location.href = "dashboard.html";
  } catch (e) {
    mensaje.innerText = "Error: " + e.message;
  }
};

registerBtn.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    mensaje.innerText = "Usuario creado con éxito";
  } catch (e) {
    mensaje.innerText = "Error: " + e.message;
  }
};
