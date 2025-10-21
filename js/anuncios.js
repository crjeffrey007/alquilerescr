// js/anuncios.js

const form = document.getElementById("formAnuncio");
const msg = document.getElementById("mensajeExito");

// Cloudinary y Web3Forms config
const CLOUD_NAME = "media-anuncios";
const UPLOAD_PRESET = "alquilerescr";
const WEB3FORMS_ACCESS_KEY = "36e1e635-e0fa-4b58-adba-4daf2694b7dd";

// 🔹 Referencias Firebase
const db = firebase.firestore();

// --- CARGAR OPCIONES DESDE FIREBASE ---
async function cargarSelects() {
  const provSel = document.getElementById("selectProvincia");
  const cantSel = document.getElementById("selectCanton");
  const catSel = document.getElementById("selectCategoria");

  provSel.innerHTML = "<option value=''>Cargando...</option>";
  const provinciasSnap = await db.collection("provincias").get();
  provSel.innerHTML = "<option value=''>Seleccione</option>";
  provinciasSnap.forEach(doc => {
    provSel.innerHTML += `<option value="${doc.data().nombre}">${doc.data().nombre}</option>`;
  });

  provSel.addEventListener("change", async () => {
    cantSel.innerHTML = "<option value=''>Cargando...</option>";
    const cantSnap = await db.collection("cantones")
      .where("provincia", "==", provSel.value)
      .get();
    cantSel.innerHTML = "<option value=''>Seleccione</option>";
    cantSnap.forEach(doc => {
      cantSel.innerHTML += `<option value="${doc.data().nombre}">${doc.data().nombre}</option>`;
    });
  });

  const catSnap = await db.collection("categorias").get();
  catSel.innerHTML = "<option value=''>Seleccione</option>";
  catSnap.forEach(doc => {
    catSel.innerHTML += `<option value="${doc.data().nombre}">${doc.data().nombre}</option>`;
  });
}

cargarSelects();

// --- SUBIR IMAGENES A CLOUDINARY ---
async function subirImagen(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  return data.secure_url;
}

// --- ENVIAR FORMULARIO ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const logoFile = document.getElementById("logo").files[0];
  const imageFiles = document.getElementById("imagenes").files;

  const logoUrl = logoFile ? await subirImagen(logoFile) : "";
  const imageUrls = [];
  for (let file of imageFiles) {
    const url = await subirImagen(file);
    imageUrls.push(url);
  }

  const anuncio = Object.fromEntries(formData.entries());
  anuncio.logo = logoUrl;
  anuncio.imagenes = imageUrls;
  anuncio.estado = "pendiente";
  anuncio.fecha = new Date();

  // Guarda en Firestore
  await db.collection("anunciosComerciales").add(anuncio);

  // Enviar notificación via Web3Forms
  await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Nuevo Anuncio Comercial Pendiente",
      from_name: "Sitio Alquileres-CR",
      message: `Nuevo anuncio de ${anuncio.nombreNegocio} pendiente de revisión.`
    })
  });

  msg.classList.remove("oculto");
  form.reset();
});
