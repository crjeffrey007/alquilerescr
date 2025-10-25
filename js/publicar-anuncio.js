// ===============================
// CONFIGURACIÓN DE FIREBASE
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a",
  measurementId: "G-21HRE9SEVG"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// CONFIGURACIÓN DE CLOUDINARY
// ===============================
const CLOUDINARY_CLOUD_NAME = "media-anuncios";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

// ===============================
// VARIABLES DE PREVIEW
// ===============================
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
      folder: "anuncios",
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
      folder: "anuncios",
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
    .map(
      (url) =>
        `<img src="${url}" style="max-height:100px;border-radius:10px;margin:5px;">`
    )
    .join("");
}

// ===============================
// ENVIAR FORMULARIO
// ===============================
document.getElementById("formAnuncio").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar CAPTCHA de Turnstile
  const turnstileResponse = document.querySelector("[name='cf-turnstile-response']");
  if (!turnstileResponse || !turnstileResponse.value) {
    alert("⚠️ Por favor, verifica el CAPTCHA antes de enviar.");
    return;
  }

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
    fechaRegistro: new Date().toISOString(),
    estado: "pendiente", // para revisión en panel admin
  };

  try {
    await db.collection("anuncios_comerciales").add(data);
    alert("✅ Tu anuncio se ha enviado correctamente. Será revisado antes de publicarse.");
    form.reset();
    previewLogo.innerHTML = "";
    previewImagenes.innerHTML = "";
    imagenesURLs = [];
    logoURL = "";
    turnstile.reset(); // resetea el captcha
  } catch (error) {
    console.error("Error al guardar anuncio:", error);
    alert("❌ Ocurrió un error al enviar el anuncio. Inténtalo de nuevo.");
  }
});
