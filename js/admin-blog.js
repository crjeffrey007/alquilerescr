import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth();

// Verifica si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
  if (!user) {
    localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
  }
});

// Cerrar sesión
document.getElementById("cerrarSesion").addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
  });
});

// ===============================
// PANEL DE ADMINISTRADOR BLOG
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// 🔹 Configuración Firebase
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

// 🔹 Inicializar Quill
const quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Escribe el contenido del artículo aquí...",
});

// 🔹 Cloudinary Config
const CLOUDINARY_CLOUD_NAME = "media-anuncios";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

let imagenDestacada = "";

// Subir imagen destacada
document.getElementById("btnSubirImagen").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "camera"],
      multiple: false,
      folder: "blog"
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        imagenDestacada = result.info.secure_url;
        document.getElementById("previewImagen").innerHTML =
          `<img src="${imagenDestacada}" alt="Imagen destacada">`;
      }
    }
  );
});

// Guardar artículo
document.getElementById("formBlog").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    titulo: titulo.value.trim(),
    descripcion: descripcion.value.trim(),
    contenido: quill.root.innerHTML,
    imagenDestacada,
    descripcionSEO: descripcionSEO.value.trim(),
    keywords: keywords.value.trim(),
    autor: autor.value.trim(),
    publicado: estado.value === "true",
    fechaPublicacion: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "blog_posts"), data);
    alert("✅ Artículo guardado correctamente.");
    e.target.reset();
    quill.setContents([]);
    imagenDestacada = "";
    document.getElementById("previewImagen").innerHTML = "";
    cargarPosts();
  } catch (err) {
    console.error(err);
    alert("❌ Error al guardar el artículo.");
  }
});

// Mostrar lista de artículos
async function cargarPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "Cargando...";
  const snapshot = await getDocs(collection(db, "blog_posts"));

  postsContainer.innerHTML = snapshot.docs
    .map(doc => {
      const data = doc.data();
      return `
        <div class="post-item">
          <h3>${data.titulo}</h3>
          <p><strong>Estado:</strong> ${data.publicado ? "Publicado ✅" : "Borrador"}</p>
        </div>
      `;
    })
    .join("");
}

cargarPosts();
