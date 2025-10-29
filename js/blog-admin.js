// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// CLOUDINARY CONFIG
// ===============================
const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "TU_UPLOAD_PRESET";

let imagenURL = "";
let editandoId = null;
let posts = [];

// ===============================
// ELEMENTOS
// ===============================
const btnNuevo = document.getElementById("btnNuevo");
const btnCancelar = document.getElementById("btnCancelar");
const formSection = document.getElementById("formularioSection");
const formBlog = document.getElementById("formBlog");
const listaBlog = document.getElementById("listaBlog");
const previewImagen = document.getElementById("previewImagen");
const tituloFormulario = document.getElementById("tituloFormulario");

const buscarTitulo = document.getElementById("buscarTitulo");
const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");
const btnFiltrar = document.getElementById("btnFiltrar");
const btnLimpiar = document.getElementById("btnLimpiar");

// ===============================
// NUEVO ARTÍCULO
// ===============================
btnNuevo.addEventListener("click", () => {
  formBlog.reset();
  imagenURL = "";
  editandoId = null;
  previewImagen.innerHTML = "";
  tituloFormulario.textContent = "Nuevo Artículo";
  formSection.classList.remove("oculto");
});

// ===============================
// CANCELAR
// ===============================
btnCancelar.addEventListener("click", () => {
  formSection.classList.add("oculto");
});

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
        previewImagen.innerHTML = `<img src="${imagenURL}" style="max-height:140px;border-radius:10px;margin-top:10px;">`;
      }
    }
  );
});

// ===============================
// GUARDAR / EDITAR ARTÍCULO
// ===============================
formBlog.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const contenido = document.getElementById("contenido").value.trim();

  if (!titulo || !contenido) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  const data = {
    titulo,
    contenido,
    imagenURL,
    fecha: new Date().toISOString()
  };

  try {
    if (editandoId) {
      await db.collection("blog").doc(editandoId).update(data);
      alert("✅ Artículo actualizado correctamente.");
    } else {
      await db.collection("blog").add(data);
      alert("✅ Artículo publicado correctamente.");
    }
    formBlog.reset();
    previewImagen.innerHTML = "";
    formSection.classList.add("oculto");
  } catch (error) {
    console.error("Error al guardar artículo:", error);
    alert("❌ Ocurrió un error al guardar el artículo.");
  }
});

// ===============================
// MOSTRAR LISTADO DE BLOGS
// ===============================
function cargarBlog() {
  db.collection("blog").orderBy("fecha", "desc").onSnapshot((snapshot) => {
    posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    mostrarPosts(posts);
  });
}

function mostrarPosts(lista) {
  listaBlog.innerHTML = "";
  if (lista.length === 0) {
    listaBlog.innerHTML = `<tr><td colspan="3">No se encontraron artículos.</td></tr>`;
    return;
  }

  lista.forEach((post) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${post.titulo}</td>
      <td>${new Date(post.fecha).toLocaleDateString("es-CR")}</td>
      <td>
        <button class="btn btn-peq" onclick="verPost('${post.id}')">👁️</button>
        <button class="btn btn-peq" onclick="editarPost('${post.id}')">✏️</button>
        <button class="btn btn-peq btn-eliminar" onclick="eliminarPost('${post.id}')">🗑️</button>
      </td>
    `;
    listaBlog.appendChild(tr);
  });
}

cargarBlog();

// ===============================
// VER / EDITAR / ELIMINAR
// ===============================
function verPost(id) {
  window.open(`ver-blog.html?id=${id}`, "_blank");
}

async function editarPost(id) {
  const doc = await db.collection("blog").doc(id).get();
  if (!doc.exists) return;

  const post = doc.data();
  editandoId = id;
  document.getElementById("titulo").value = post.titulo;
  document.getElementById("contenido").value = post.contenido;
  imagenURL = post.imagenURL || "";
  previewImagen.innerHTML = imagenURL
    ? `<img src="${imagenURL}" style="max-height:140px;border-radius:10px;">`
    : "";

  tituloFormulario.textContent = "Editar Artículo";
  formSection.classList.remove("oculto");
}

async function eliminarPost(id) {
  if (confirm("¿Seguro que deseas eliminar este artículo?")) {
    await db.collection("blog").doc(id).delete();
    alert("🗑️ Artículo eliminado.");
  }
}

// ===============================
// FILTROS
// ===============================
btnFiltrar.addEventListener("click", () => {
  const texto = buscarTitulo.value.toLowerCase();
  const desde = fechaInicio.value ? new Date(fechaInicio.value) : null;
  const hasta = fechaFin.value ? new Date(fechaFin.value) : null;

  const filtrados = posts.filter((p) => {
    const tituloMatch = p.titulo.toLowerCase().includes(texto);
    const fecha = new Date(p.fecha);
    const fechaMatch =
      (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    return tituloMatch && fechaMatch;
  });

  mostrarPosts(filtrados);
});

btnLimpiar.addEventListener("click", () => {
  buscarTitulo.value = "";
  fechaInicio.value = "";
  fechaFin.value = "";
  mostrarPosts(posts);
});
