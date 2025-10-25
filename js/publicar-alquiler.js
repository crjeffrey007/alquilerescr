// ===============================
// PUBLICAR ANUNCIO DE ALQUILER
// ===============================

// ✅ Firebase Configuración
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a",
  measurementId: "G-21HRE9SEVG"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🌥️ Cloudinary Config
const CLOUDINARY_CLOUD_NAME = "media-anuncios";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

let imagenesURLs = [];
const previewContainer = document.getElementById("previewImagenes");

// ===============================
// SUBIR FOTOS
// ===============================
document.getElementById("btnSubirFotos").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "camera"],
      multiple: true,
      folder: "alquileres"
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        imagenesURLs.push(result.info.secure_url);
        previewContainer.innerHTML = imagenesURLs
          .map(url => `<img src="${url}" style="max-height:100px;margin:5px;border-radius:8px;">`)
          .join("");
      }
    }
  );
});

// ===============================
// ENVIAR FORMULARIO
// ===============================
document.getElementById("formAlquiler").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;

  // 🔐 Verificar Turnstile
  const token = document.querySelector('[name="cf-turnstile-response"]').value;
  if (!token) {
    alert("⚠️ Por favor, completa la verificación antes de enviar.");
    return;
  }

  const data = {
    tipo: "Alquiler",
    titulo: f.titulo.value,
    descripcion: f.descripcion.value,
    area: f.area.value,
    construccion: f.construccion.value,
    amoblado: f.amoblado.value,
    habitaciones: f.habitaciones.value,
    banos: f.banos.value,
    muebles: Array.from(f.querySelectorAll("input[name='muebles[]']:checked")).map(x => x.value),
    servicios: Array.from(f.querySelectorAll("input[name='servicios[]']:checked")).map(x => x.value),
    direccion: f.direccion.value,
    distrito: f.distrito.value,
    canton: f.canton.value,
    provincia: f.provincia.value,
    pais: f.pais.value,
    moneda: f.moneda.value,
    nombre: f.nombre.value,
    apellidos: f.apellidos.value,
    email: f.email.value,
    telefono: f.telefono.value,
    aceptaComision: f.comision.checked,
    imagenes: imagenesURLs,
    fechaRegistro: new Date().toISOString(),
    activo: true
  };

  try {
    await db.collection("anuncios_alquileres").add(data);
    alert("✅ Tu anuncio de alquiler se ha enviado correctamente.");
    f.reset();
    previewContainer.innerHTML = "";
    imagenesURLs = [];
    turnstile.reset(); // reset CAPTCHA
  } catch (error) {
    console.error(error);
    alert("❌ Error al enviar. Intenta de nuevo.");
  }
});
