// js/ver-anuncio.js
import { db } from './firebase.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js';

const container = document.getElementById('anuncio');
const params = new URLSearchParams(location.search);
const id = params.get('id');
const tipo = params.get('tipo') || 'alquileres'; // coleccion por defecto

async function cargarAnuncio() {
  if(!id) {
    container.innerHTML = '<p>No se encontró el anuncio.</p>';
    return;
  }

  const ref = doc(db, tipo, id);
  const snap = await getDoc(ref);
  if(!snap.exists()) {
    container.innerHTML = '<p>Anuncio no encontrado.</p>';
    return;
  }

  const d = snap.data();
  container.innerHTML = `
    <h1>${d.titulo}</h1>
    <div class="precio">${d.precio ? d.precio + ' ' + (d.moneda || '') : ''}</div>
    <div class="galeria">
      ${(d.imagenes||[]).map(url=>`<img src="${url}" alt="foto">`).join('')}
      ${(d.videos||[]).map(url=>`<video src="${url}" controls></video>`).join('')}
    </div>
    <div class="info">
      <p><strong>Descripción:</strong> ${d.descripcion||''}</p>
      <p><strong>Provincia:</strong> ${d.provincia||''}</p>
      <p><strong>Dirección:</strong> ${d.direccion||''}</p>
      ${d.email ? `<p><strong>Contacto:</strong> ${d.email}</p>` : ''}
      ${d.telefono ? `<p><strong>Teléfono:</strong> ${d.telefono}</p>` : ''}
      <hr>
      <p>Publicado: ${d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : ''}</p>
    </div>
  `;
}

cargarAnuncio();
