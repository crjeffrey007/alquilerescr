// ===============================
// BLOG LISTADO (blog.js)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos del DOM
const blogListado = document.getElementById("blogListado");
const buscarPost = document.getElementById("buscarPost");

// Cargar publicaciones publicadas
async function cargarPosts() {
  blogListado.innerHTML = "<p>Cargando artículos...</p>";

  const q = query(
    collection(db, "blog_posts"),
    where("publicado", "==", true),
    orderBy("fechaPublicacion", "desc")
  );

  const snapshot = await getDocs(q);
  mostrarPosts(snapshot.docs);
}

// Mostrar posts
function mostrarPosts(posts) {
  if (posts.length === 0) {
    blogListado.innerHTML = "<p>No hay artículos publicados aún.</p>";
    return;
  }

  blogListado.innerHTML = posts.map(doc => {
    const data = doc.data();
    const preview = data.contenido.replace(/<[^>]+>/g, "").slice(0, 160) + "...";
    const img = data.imagenDestacada || "https://via.placeholder.com/400x250?text=Sin+Imagen";

    return `
      <article class="blog-card">
        <img src="${img}" alt="${data.titulo}">
        <div class="blog-card-content">
          <h2>${data.titulo}</h2>
          <p>${preview}</p>
          <a href="blog-post.html?id=${doc.id}" class="btn-leer">Leer más</a>
        </div>
      </article>
    `;
  }).join("");
}

// Buscar artículos
buscarPost.addEventListener("input", async (e) => {
  const termino = e.target.value.toLowerCase();

  const q = query(
    collection(db, "blog_posts"),
    where("publicado", "==", true)
  );

  const snapshot = await getDocs(q);
  const filtrados = snapshot.docs.filter(doc => {
    const data = doc.data();
    return (
      data.titulo.toLowerCase().includes(termino) ||
      data.descripcion.toLowerCase().includes(termino)
    );
  });

  mostrarPosts(filtrados);
});

// Iniciar carga
cargarPosts();
