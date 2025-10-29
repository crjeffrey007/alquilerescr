// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// CLOUDINARY CONFIG
// ===============================
const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "TU_UPLOAD_PRESET";

let imagenURL = "";
const previewImagen = document.getElementById("previewImagen");

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
        imagenURL = result.info.secure_url;
        previewImagen.innerHTML = `<img src="${imagenURL}" style="max-height:150px;border-radius:10px;">`;
      }
    }
  );
});

// ===============================
// PUBLICAR POST
// ===============================
const form = document.getElementById("formPost");
form.addEventListener("submit", async e => {
  e.preventDefault();

  const titulo = form.titulo.value.trim();
  const contenido = form.contenido.value.trim();

  if (!titulo || !contenido || !imagenURL) {
    alert("Completa todos los campos y sube una imagen.");
    return;
  }

  try {
    await db.collection("blog").add({
      titulo,
      contenido,
      imagenURL,
      fecha: new Date().toISOString()
    });
    alert("✅ Artículo publicado correctamente");
    form.reset();
    previewImagen.innerHTML = "";
  } catch (error) {
    console.error("Error al publicar:", error);
  }
});

// ===============================
// LISTAR Y ELIMINAR POSTS
// ===============================
const listaPosts = document.getElementById("listaPosts");

function cargarPosts() {
  db.collection("blog").orderBy("fecha", "desc").onSnapshot(snapshot => {
    listaPosts.innerHTML = snapshot.docs.map(doc => {
      const post = doc.data();
      return `
        <div class="post-admin">
          <h3>${post.titulo}</h3>
          <button onclick="eliminarPost('${doc.id}')">🗑️ Eliminar</button>
        </div>
      `;
    }).join("");
  });
}

cargarPosts();

async function eliminarPost(id) {
  if (confirm("¿Seguro que deseas eliminar este artículo?")) {
    await db.collection("blog").doc(id).delete();
    alert("Artículo eliminado");
  }
}
