import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const container = document.getElementById('anuncioCard');
if(!id){ container.innerHTML='<p>ID de anuncio no proporcionado.</p>'; }

async function cargar(){
  const refDoc = doc(db,'anuncios',id);
  const snap = await getDoc(refDoc);
  if(!snap.exists()){ container.innerHTML='<p>Anuncio no encontrado.</p>'; return; }
  const d = snap.data();
  const whatsapp = d.telefono ? `https://wa.me/506${d.telefono.replace(/\D/g,'')}` : '#';
  container.innerHTML = `
    <h2>${d.titulo||d.nombre_comercial}</h2>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <div style="flex:1;min-width:280px"><img src="${d.imagenes?.[0]||'img/no-photo.jpg'}" style="width:100%;height:320px;object-fit:cover"></div>
      <div style="flex:1;min-width:280px">
        <p><strong>Ubicación:</strong> ${d.provincia||''} · ${d.canton||''} ${d.distrito? '· '+d.distrito : ''}</p>
        <p>${d.descripcion||d.resumen||''}</p>
        <p><strong>Precio:</strong> ${d.precio? '₡ '+Number(d.precio).toLocaleString() : 'Consultar'}</p>
        <p><strong>Contacto:</strong> ${d.telefono||d.web||'--'}</p>
        <p><a class="btn" href="${whatsapp}" target="_blank">Contactar por WhatsApp</a></p>
      </div>
    </div>
    <div style="margin-top:16px">
      ${d.mapa ? `<iframe width="100%" height="350" style="border:0" src="${d.mapa}" loading="lazy"></iframe>` : ''}
    </div>
  `;
}
cargar();
