// js/editar-anuncio.js
import { db } from './firebase.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js';
import { subirArchivosCloudinary } from './upload.js';

const form = document.getElementById('formEditar');
const msg = document.getElementById('msgEditar');
const params = new URLSearchParams(location.search);
const id = params.get('id');
const tipo = params.get('tipo') || 'alquileres';
let ref;

async function cargar() {
  ref = doc(db, tipo, id);
  const snap = await getDoc(ref);
  if(!snap.exists()) {
    msg.textContent = 'No existe el anuncio.';
    return;
  }
  const d = snap.data();
  form.titulo.value = d.titulo || '';
  form.descripcion.value = d.descripcion || '';
  form.precio.value = d.precio || '';
  form.moneda.value = d.moneda || 'CRC';
}
cargar();

form.addEventListener('submit', async e => {
  e.preventDefault();
  msg.textContent = 'Guardando...';
  try {
    const data = {
      titulo: form.titulo.value,
      descripcion: form.descripcion.value,
      precio: form.precio.value,
      moneda: form.moneda.value
    };
    const imgs = document.getElementById('editar-img').files;
    const vids = document.getElementById('editar-vid').files;
    if (imgs.length) data.imagenes = await subirArchivosCloudinary(imgs, 'image');
    if (vids.length) data.videos = await subirArchivosCloudinary(vids, 'video');
    await updateDoc(ref, data);
    msg.textContent = 'Cambios guardados correctamente.';
  } catch (err) {
    console.error(err);
    msg.textContent = 'Error al guardar.';
  }
});
