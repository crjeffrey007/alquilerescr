// js/publicar-blog.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

/* ---------- CONFIG (REEMPLAZAR) ---------- */
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MSG_SENDER_ID",
  appId: "TU_APP_ID"
};
const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "TU_UPLOAD_PRESET";
/* ------------------------------------------ */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById('formPublicar');
const btnUploadFeatured = document.getElementById('btnUploadFeatured');
const previewFeatured = document.getElementById('previewFeatured');

let featuredURL = '';

const quill = new Quill('#editor', { theme: 'snow' });

// Optional: require auth (only admins can post)
// here we check auth and enforce redirect if not logged
onAuthStateChanged(auth, user => {
  // If you want only admins, check 'admins' collection or custom claims on server
  if (!user) {
    alert('Debes iniciar sesión para publicar.');
    window.location.href = '/admin/admin-login.html';
  }
});

btnUploadFeatured.addEventListener('click', () => {
  cloudinary.openUploadWidget({
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    sources: ['local','camera'],
    multiple: false,
    folder: 'blog'
  }, (err, result) => {
    if (!err && result && result.event === 'success') {
      featuredURL = result.info.secure_url;
      previewFeatured.innerHTML = `<img src="${featuredURL}" style="max-width:320px;border-radius:8px">`;
    }
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const tituloSeo = document.getElementById('tituloSeo').value.trim();
  const descripcionSeo = document.getElementById('descripcionSeo').value.trim();
  const categoriaName = document.getElementById('categoriaName').value.trim();
  const provincia = document.getElementById('provincia').value.trim();
  const keywords = (document.getElementById('keywords').value || '').split(',').map(s=>s.trim()).filter(Boolean);
  const contenido = quill.root.innerHTML;
  const activo = document.getElementById('activo').checked;

  if (!titulo || !contenido) return alert('Título y contenido son obligatorios');

  const slugBase = generateSlug(titulo);
  const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

  const data = {
    titulo,
    tituloSeo: tituloSeo || titulo,
    descripcionSeo,
    palabrasClave: keywords,
    categoriaName,
    provincia,
    slug,
    imagenDestacada: featuredURL || '',
    contenido,
    activo: !!activo,
    fecha: new Date().toISOString(),
    autorEmail: (auth.currentUser && auth.currentUser.email) || 'admin'
  };

  try {
    await addDoc(collection(db, 'blog'), data);
    alert('Artículo guardado correctamente');
    form.reset();
    quill.setText('');
    previewFeatured.innerHTML = '';
    featuredURL = '';
  } catch (err) {
    console.error(err);
    alert('Error guardando el artículo');
  }
});

// helpers
function generateSlug(text){
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9 -]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'');
}
