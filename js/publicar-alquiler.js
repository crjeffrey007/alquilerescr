// --- CONFIGURACIÓN PRINCIPAL ---
import { db, auth } from "./firebase.js";
import { 
  collection, addDoc, getDocs, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const form = document.getElementById("form-alquiler");
const misAnunciosDiv = document.getElementById("mis-anuncios");

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/media-anuncios/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "alquilerescr";

const WEB3FORMS_ACCESS_KEY = "36e1e635-e0fa-4b58-adba-4daf2694b7dd";


// --- SUBIR IMÁGENES A CLOUDINARY ---
async function uploadImages(files) {
  const urls = [];
  for (let file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.secure_url) urls.push(data.secure_url);
  }
  return urls;
}


// --- GUARDAR ANUNCIO EN FIRESTORE ---
async function saveAnuncio(data) {
  const docRef = await addDoc(collection(db, "alquileres"), data);
  return docRef.id;
}


// --- CARGAR ANUNCIOS DEL USUARIO ---
async function loadMisAnuncios() {
  misAnunciosDiv.innerHTML = "<p>Cargando tus anuncios...</p>";

  const querySnap = await getDocs(collection(db, "alquileres"));
  let html = "";

  querySnap.forEach(docSnap => {
    const anuncio = docSnap.data();
    html += `
      <div class="anuncio-card" data-id="${docSnap.id}">
        <h4>${anuncio.titulo}</h4>
        <p><strong>Estado:</strong> ${anuncio.activo ? "✅ Activo" : "⛔ Desactivado"}</p>
        <p>${anuncio.descripcion}</p>
        <button class="btn-toggle">${anuncio.activo ? "Desactivar" : "Activar"}</button>
      </div>
    `;
  });

  misAnunciosDiv.innerHTML = html || "<p>No has publicado anuncios todavía.</p>";

  document.querySelectorAll(".btn-toggle").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.closest(".anuncio-card").dataset.id;
      const isActive = e.target.textContent === "Desactivar";
      await updateDoc(doc(db, "alquileres", id), { activo: !isActive });
      loadMisAnuncios();
    });
  });
}


// --- ENVIAR NOTIFICACIÓN A WEB3FORMS ---
async function sendNotification(data) {
  const formData = new FormData();
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append("subject", "📢 Nuevo anuncio de alquiler publicado");
  formData.append("from_name", data.nombre + " " + data.apellidos);
  formData.append("from_email", data.email);
  formData.append("message", `
Nuevo anuncio publicado:
Título: ${data.titulo}
Descripción: ${data.descripcion}
Teléfono: ${data.telefono}
Dirección: ${data.direccion}, ${data.canton}, ${data.provincia}, ${data.pais}
  `);

  await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData
  });
}


// --- MANEJO DEL FORMULARIO ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  form.querySelector("button").disabled = true;

  try {
    const imagenes = await uploadImages(document.getElementById("imagenes").files);

    const formData = Object.fromEntries(new FormData(form).entries());
    const data = {
      ...formData,
      imagenes,
      activo: true,
      fecha: new Date().toISOString()
    };

    await saveAnuncio(data);
    await sendNotification(data);

    alert("✅ Tu anuncio se ha publicado con éxito.");
    form.reset();
    loadMisAnuncios();
  } catch (err) {
    console.error(err);
    alert("❌ Error al publicar el anuncio.");
  }

  form.querySelector("button").disabled = false;
});


// --- CARGAR AL INICIAR ---
loadMisAnuncios();
