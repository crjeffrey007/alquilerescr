// ===============================
// PUBLICAR ANUNCIO COMERCIAL
// ===============================

// ✅ Configurar tus claves de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// CLOUDINARY CONFIG
// ===============================
const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "TU_UPLOAD_PRESET";

// Campos de preview
const previewLogo = document.getElementById("previewLogo");
const previewImagenes = document.getElementById("previewImagenes");

let logoURL = "";
let imagenesURLs = [];

// ===============================
// SUBIR LOGO
// ===============================
document.getElementById("btnSubirLogo").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "camera"],
      multiple: false,
      folder: "anuncios"
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        logoURL = result.info.secure_url;
        previewLogo.innerHTML = `<img src="${logoURL}" alt="Logo" style="max-height:120px;border-radius:10px;margin-top:10px;">`;
      }
    }
  );
});

// ===============================
// SUBIR IMÁGENES
// ===============================
document.getElementById("btnSubirImagenes").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "camera"],
      multiple: true,
      folder: "anuncios"
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        imagenesURLs.push(result.info.secure_url);
        mostrarPreviewImagenes();
      }
    }
  );
});

function mostrarPreviewImagenes() {
  previewImagenes.innerHTML = imagenesURLs
    .map(url => `<img src="${url}" style="max-height:100px;border-radius:10px;margin:5px;">`)
    .join("");
}

// ===============================
// ENVIAR FORMULARIO
// ===============================
document.getElementById("formAnuncio").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    tipoAnuncio: form.tipoAnuncio.value,
    titulo: form.titulo.value.trim(),
    descripcion: form.descripcion.value.trim(),
    nombreNegocio: form.nombreNegocio.value.trim(),
    telefono: form.telefono.value.trim(),
    email: form.email.value.trim(),
    logoURL,
    imagenesURLs,
    nombre: form.nombre.value.trim(),
    apellidos: form.apellidos.value.trim(),
    horario: form.horario.value,
    direccion: form.direccion.value.trim(),
    distrito: form.distrito.value.trim(),
    canton: form.canton.value.trim(),
    provincia: form.provincia.value,
    pais: form.pais.value.trim(),
    domicilio: form.domicilio.value,
    aceptaVeracidad: form.aceptaVeracidad.checked,
    fechaRegistro: new Date().toISOString()
  };

  try {
    await db.collection("anuncios_comerciales").add(data);
    alert("✅ Tu anuncio se ha enviado correctamente. Será revisado antes de publicarse.");
    form.reset();
    previewLogo.innerHTML = "";
    previewImagenes.innerHTML = "";
    imagenesURLs = [];
    logoURL = "";
  } catch (error) {
    console.error("Error al guardar anuncio:", error);
    alert("❌ Ocurrió un error al enviar el anuncio. Inténtalo de nuevo.");
  }
});
