// Cargar SDKs de Firebase (versión 8.x)
document.write(`
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js"></script>
`);

// Inicializar Firebase al cargar la página
window.addEventListener("load", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
    authDomain: "inmobiliaria-cr.firebaseapp.com",
    projectId: "inmobiliaria-cr",
    storageBucket: "inmobiliaria-cr.appspot.com", // corregido
    messagingSenderId: "594252224879",
    appId: "1:594252224879:web:6321a05511f67e2d13309a",
    measurementId: "G-21HRE9SEVG"
  };

  // Inicializar Firebase solo una vez
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase inicializado correctamente");
  } else {
    firebase.app();
  }

  // Hacer accesibles las variables globalmente
  window.auth = firebase.auth();
  window.db = firebase.firestore();
  window.storage = firebase.storage();
});

