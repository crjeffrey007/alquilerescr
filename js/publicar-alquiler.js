import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js';

// Config Cloudinary
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/media-anuncios/upload';
const UPLOAD_PRESET = 'alquilerescr';

const form = document.getElementById('form-alquiler');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = "Subiendo anuncio...";

  try {
    const data = Object.fromEntries(new FormData(form).entries());
    data.fecha = serverTimestamp();
    data.activo = true;
    data.tipo = "alquiler";

    // Subir imágenes
    const imagenes = Array.from(document.getElementById('imagenes').files);
    const urlsImg = await Promise.all(imagenes.map(subirArchivoCloudinary));

    // Subir videos
    const videos = Array.from(document.getElementById('videos').files);
    const urlsVid = await Promise.all(videos.map(subirArchivoCloudinary));

    data.imagenes = urlsImg;
    data.videos = urlsVid;

    await addDoc(collection(db, "alquileres"), data);
    msg.textContent = "✅ Alquiler publicado correctamente.";
    form.reset();

  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Error al publicar: " + err.message;
  }
});

async function subirArchivoCloudinary(archivo) {
  const formData = new FormData();
  formData.append('file', archivo);
  formData.append('upload_preset', UPLOAD_PRESET);
  const res = await axios.post(CLOUDINARY_URL, formData);
  return res.data.secure_url;
}
