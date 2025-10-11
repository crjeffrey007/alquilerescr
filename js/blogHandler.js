import { db, storage, auth } from "./firebase.js";
import {
  collection, addDoc, getDocs, serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Referencias
const form = document.getElementById("formBlog");
const blogList = document.getElementById("blogList");
const editor = document.getElementById("adminEditor");
const mensaje = document.getElementById("mensajeBlog");

// Mostrar editor solo si es admin
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "crjeffrey7@gmail.com") {
    editor.style.display = "block";
  }
});

// Cargar artículos
async function cargarBlog() {
  blogList.innerHTML = "";
  const q = query(collection(db, "blog"), orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const art = doc.data();
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${art.imagen}" alt="${art.titulo}">
      <div class="card-content">
        <h3>${art.titulo}</h3>
        <p><small>${art.categoria}</small></p>
        <p>${art.contenido.substring(0, 150)}...</p>
      </div>
    `;
    blogList.appendChild(card);
  });
}
cargarBlog();

// Publicar artículo (solo admin)
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = form.titulo.value.trim();
    const categoria = form.categoria.value;
    const contenido = form.contenido.value.trim();
    const archivo = form.imagenDestacada.files[0];

    if (!archivo) {
      mensaje.textContent = "Selecciona una imagen destacada.";
      return;
    }

    try {
      const refImg = ref(storage, "blog/" + archivo.name);
      await uploadBytes(refImg, archivo);
      const url = await getDownloadURL(refImg);

      await addDoc(collection(db, "blog"), {
        titulo,
        categoria,
        contenido,
        imagen: url,
        fecha: serverTimestamp(),
      });

      mensaje.textContent = "✅ Artículo publicado con éxito";
      form.reset();
      cargarBlog();
    } catch (err) {
      mensaje.textContent = "❌ Error: " + err.message;
    }
  });
}
