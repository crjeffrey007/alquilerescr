// ===============================
// BLOG POST INDIVIDUAL (blog-post.js)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a",
  measurementId: "G-21HRE9SEVG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const postContenido = document.getElementById("postContenido");

// Obtener el ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  postContenido.innerHTML = "<p>Artículo no encontrado.</p>";
} else {
  cargarPost(id);
}

async function cargarPost(id) {
  const ref = doc(db, "blog_posts", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    postContenido.innerHTML = "<p>Este artículo no existe o fue eliminado.</p>";
    return;
  }

  const data = snap.data();

  if (!data.publicado) {
    postContenido.innerHTML = "<p>Este artículo aún no ha sido publicado.</p>";
    return;
  }

  // Mostrar contenido
  postContenido.innerHTML = `
    <h1>${data.titulo}</h1>
    <p class="meta">Publicado el ${new Date(data.fechaPublicacion).toLocaleDateString()}</p>
    <img src="${data.imagenDestacada}" alt="${data.titulo}">
    <div class="contenido">${data.contenido}</div>
  `;

  // Actualizar etiquetas SEO dinámicas
  document.title = `${data.titulo} | Alquileres CR`;
  document.getElementById("meta-description").content = data.descripcionSEO || data.descripcion || "";
  document.getElementById("meta-keywords").content = data.keywords || "alquileres, propiedades, costa rica, blog";
}
