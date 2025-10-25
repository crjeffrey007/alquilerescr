// ===============================
// PUBLICAR ANUNCIO COMERCIAL
// ===============================
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const CLOUDINARY_CLOUD_NAME = "media-anuncios";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

let logoURL = "";
let imagenesURLs = [];

const previewLogo = document.getElementById("previewLogo");
const previewImagenes = document.getElementById("previewImagenes");

// SUBIR LOGO
document.getElementById("btnSubirLogo").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      multiple: false,
      folder: "anuncios"
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        logoURL = result.info.secure_url;
        previewLogo.innerHTML = `<img src="${logoURL}" style="max-height:120px;border-radius:10px;">`;
      }
    }
  );
});

// SUBIR IMÁGENES
document.getElementById("btnSubirImagenes").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      multiple: true,
      folder: "anuncios"
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        imagenesURLs.push(result.info.secure_url);
        previewImagenes.innerHTML = imagenesURLs
          .map(url => `<img src="${url}" style="max-height:100px;border-radius:8px;margin:5px;">`)
          .join("");
      }
    }
  );
});

// ENVIAR FORMULARIO
document.getElementById("formAnuncio").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;

  const token = document.querySelector('[name="cf-turnstile-response"]').value;
  if (!token) {
    alert("⚠️ Completa la verificación antes de enviar.");
    return;
  }

  const data = {
    tipoAnuncio: f.tipoAnuncio.value,
    titulo: f.titulo.value,
    descripcion: f.descripcion.value,
    nombreNegocio: f.nombreNegocio.value,
    telefono: f.telefono.value,
    email: f.email.value,
    logoURL,
    imagenesURLs,
    nombre: f.nombre.value,
    apellidos: f.apellidos.value,
    horario: f.horario.value,
    direccion: f.direccion.value,
    distrito: f.distrito.value,
    canton: f.canton.value,
    provincia: f.provincia.value,
    pais: f.pais.value,
    domicilio: f.domicilio.value,
    aceptaVeracidad: f.aceptaVeracidad.checked,
    fechaRegistro: new Date().toISOString(),
    activo: true
  };

  try {
    await db.collection("anuncios_comerciales").add(data);
    alert("✅ Tu anuncio comercial se envió correctamente.");
    f.reset();
    previewLogo.innerHTML = "";
    previewImagenes.innerHTML = "";
    imagenesURLs = [];
    logoURL = "";
    turnstile.reset();
  } catch (error) {
    console.error(error);
    alert("❌ Error al enviar. Intenta de nuevo.");
  }
});
