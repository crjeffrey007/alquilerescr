// ==========================
//  AUTH.JS - Firebase Auth
// ==========================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a",
  measurementId: "G-21HRE9SEVG"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


// ==========================
//  REGISTRO DE USUARIOS
// ==========================
async function registerUser(email, password, nombre) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Guarda datos en Firestore
    await db.collection("usuarios").doc(user.uid).set({
      nombre: nombre,
      email: email,
      rol: "usuario", // por defecto
      creado: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Registro exitoso. ¡Bienvenido " + nombre + "!");
    window.location.href = "panel.html"; // Redirige al panel
  } catch (error) {
    console.error("Error al registrar:", error);
    alert("❌ Error: " + error.message);
  }
}


// ==========================
//  LOGIN DE USUARIOS
// ==========================
async function loginUser(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Busca si es admin o usuario normal
    const doc = await db.collection("usuarios").doc(user.uid).get();
    const rol = doc.exists ? doc.data().rol : "usuario";

    if (rol === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "panel.html";
    }

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("❌ Error: " + error.message);
  }
}


// ==========================
//  LOGOUT / CERRAR SESIÓN
// ==========================
async function logoutUser() {
  try {
    await auth.signOut();
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}


// ==========================
//  VERIFICAR SESIÓN ACTIVA
// ==========================
auth.onAuthStateChanged(async (user) => {
  const userPanel = document.getElementById("user-info");
  if (user) {
    const doc = await db.collection("usuarios").doc(user.uid).get();
    const data = doc.exists ? doc.data() : { nombre: "Usuario" };

    if (userPanel) {
      userPanel.innerHTML = `
        <p>👋 Hola, ${data.nombre}</p>
        <button onclick="logoutUser()">Cerrar sesión</button>
      `;
    }
  } else {
    if (userPanel) userPanel.innerHTML = `<a href="login.html">Iniciar sesión</a>`;
  }
});
