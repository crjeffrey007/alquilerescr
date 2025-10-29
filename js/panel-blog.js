// ===============================
// CONFIGURACIÓN FIREBASE
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// CLOUDINARY CONFIG
// ===============================
const CLOUDINARY_CLOUD_NAME = "media-anuncios";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

let imagenDestacada = "";

// ===============================
// SUBIR IMAGEN DESTACADA
// ===============================
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
        document.getElementById("previewImagen").innerHTML = `
          <img src="${imagenDestacada}" alt="Imagen destacada" style="max-width:200px;border-radius:10px;margin-top:10px;">
        `;
      }
    }
  );
});

// ===============================
// GUARDAR PUBLICACIÓN
// ===============================
document.getElementById("formBlog").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const categoria = document.getElementById("categoria").value;
  const contenido = document.getElementById("contenido").value.trim();

  if (!titulo || !contenido) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  try {
    await db.collection("blog").add({
      titulo,
      categoria,
      contenido,
      imagen: imagenDestacada,
      activo: false, // oculto hasta que vos lo actives
      fecha: new Date().toISOString()
    });

    alert("✅ Publicación guardada correctamente. Está pendiente de activación.");
    document.getElementById("formBlog").reset();
    document.getElementById("previewImagen").innerHTML = "";
    imagenDestacada = "";
    cargarPublicaciones();
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("❌ Error al guardar la publicación");
  }
});

// ===============================
// LISTAR PUBLICACIONES
// ===============================
async function cargarPublicaciones() {
  const lista = document.getElementById("listaBlog");
  lista.innerHTML = "<p>Cargando publicaciones...</p>";

  const snapshot = await db.collection("blog").orderBy("fecha", "desc").get();
  if (snapshot.empty) {
    lista.innerHTML = "<p>No hay publicaciones.</p>";
    return;
  }

  lista.innerHTML = snapshot.docs.map(doc => {
    const p = doc.data();
    return `
      <div class="item-blog">
        <h3>${p.titulo}</h3>
        <p><strong>Categoría:</strong> ${p.categoria}</p>
        <p><strong>Estado:</strong> ${p.activo ? "🟢 Activo" : "🔴 Inactivo"}</p>
        ${p.imagen ? `<img src="${p.imagen}" style="max-width:150px;border-radius:5px;">` : ""}
        <div class="acciones">
          <button onclick="toggleActivo('${doc.id}', ${p.activo})">${p.activo ? "Desactivar" : "Activar"}</button>
          <button onclick="eliminarPublicacion('${doc.id}')">Eliminar</button>
        </div>
      </div>
    `;
  }).join("");
}

// ===============================
// ACTIVAR / DESACTIVAR
// ===============================
async function toggleActivo(id, actual) {
  try {
    await db.collection("blog").doc(id).update({ activo: !actual });
    cargarPublicaciones();
  } catch (err) {
    console.error("Error:", err);
  }
}

// ===============================
// ELIMINAR
// ===============================
async function eliminarPublicacion(id) {
  if (confirm("¿Seguro que deseas eliminar esta publicación?")) {
    await db.collection("blog").doc(id).delete();
    cargarPublicaciones();
  }
}

cargarPublicaciones();
