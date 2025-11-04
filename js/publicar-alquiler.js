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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// CLOUDINARY CONFIG
// ===============================
const CLOUDINARY_CLOUD_NAME = "media-anuncios";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

// ===============================
// PREVIEWS
// ===============================
const previewFotos = document.getElementById("previewFotos");
let fotosURLs = [];

// ===============================
// SUBIR FOTOGRAFÍAS
// ===============================
document.getElementById("btnSubirFotos").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "camera"],
      multiple: true,
      folder: "alquilerescr",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        fotosURLs.push(result.info.secure_url);
        mostrarPreviewFotos();
      }
    }
  );
});

function mostrarPreviewFotos() {
  previewFotos.innerHTML = fotosURLs
    .map(url => `<img src="${url}" style="max-height:100px;border-radius:10px;margin:5px;">`)
    .join("");
}

// ===============================
// ENVIAR FORMULARIO DE ALQUILER
// ===============================
document.getElementById("formAlquiler").addEventListener("submit", async (e) => {
  e.preventDefault();

  const turnstileResponse = document.querySelector("[name='cf-turnstile-response']");
  if (!turnstileResponse || !turnstileResponse.value) {
    alert("⚠️ Por favor, verifica el CAPTCHA antes de enviar.");
    return;
  }

  const form = e.target;
  const data = {
    tipo: "alquiler",
    titulo: form.titulo.value.trim(),
    descripcion: form.descripcion.value.trim(),
    areaTerreno: form.areaTerreno.value.trim(),
    areaConstruccion: form.areaConstruccion.value.trim(),
    amoblado: form.amoblado.value,
    tiene: Array.from(form.querySelectorAll("input[name='tiene[]']:checked")).map(i => i.value),
    habitaciones: form.habitaciones.value,
    banos: form.banos.value,
    muebles: Array.from(form.querySelectorAll("input[name='muebles[]']:checked")).map(i => i.value),
    incluyeServicios: form.incluyeServicios.value,
    servicios: Array.from(form.querySelectorAll("input[name='servicios[]']:checked")).map(i => i.value),
    direccion: form.direccion.value.trim(),
    distrito: form.distrito.value.trim(),
    canton: form.canton.value.trim(),
    provincia: form.provincia.value,
    pais: form.pais.value.trim(),
    moneda: form.moneda.value,
    nombre: form.nombre.value.trim(),
    apellidos: form.apellidos.value.trim(),
    email: form.email.value.trim(),
    telefono: form.telefono.value.trim(),
    aceptaComision: form.aceptaComision.checked,
    fotos: fotosURLs,
    fechaRegistro: new Date().toISOString(),
    estado: "pendiente",
  };

  try {
    await db.collection("propiedades_alquiler").add(data);
    alert("✅ Tu propiedad en alquiler se ha enviado correctamente.");
    form.reset();
    previewFotos.innerHTML = "";
    fotosURLs = [];
    turnstile.reset();
  } catch (error) {
    console.error("Error al guardar alquiler:", error);
    alert("❌ Error al enviar. Inténtalo nuevamente.");
  }
});
