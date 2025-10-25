// ===============================
// PUBLICAR ANUNCIO DE VENTA
// ===============================
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const CLOUDINARY_CLOUD_NAME = "media-anuncios";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

let imagenesURLs = [];
const previewContainer = document.getElementById("previewImagenes");

document.getElementById("btnSubirFotos").addEventListener("click", () => {
  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      multiple: true,
      folder: "ventas"
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

document.getElementById("formVenta").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;

  const token = document.querySelector('[name="cf-turnstile-response"]').value;
  if (!token) {
    alert("⚠️ Completa la verificación antes de enviar.");
    return;
  }

  const data = {
    tipo: "Venta",
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
    await db.collection("anuncios_ventas").add(data);
    alert("✅ Tu anuncio de venta se ha enviado correctamente.");
    f.reset();
    previewContainer.innerHTML = "";
    imagenesURLs = [];
    turnstile.reset();
  } catch (error) {
    console.error(error);
    alert("❌ Error al enviar. Intenta de nuevo.");
  }
});
