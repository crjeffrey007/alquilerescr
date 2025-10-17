// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a",
  measurementId: "G-21HRE9SEVG"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
