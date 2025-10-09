import { db } from './firebase-config.js';
import { collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';

const container = document.getElementById('anunciosContainer');
const path = location.pathname;
let tipoPagina = 'alquiler';
if (path.includes('ventas')) tipoPagina = 'venta';
if (path.includes('anuncios')) tipoPagina = 'negocio';

async function cargarTodos(){
  if(!container) return;
  container.innerHTML = 'Cargando...';
  const q = query(collection(db,'anuncios'), where('estado','==','aprobado'), orderBy('fechaCreado','desc'));
  const snap = await getDocs(q);
  container.innerHTML = '';
  snap.forEach(doc=>{
    const d = doc.data();
    if(tipoPagina === 'negocio'){
      // mostrar negocios (no filtramos por d.tipo)
    }else{
      if(d.tipo && d.tipo !== tipoPagina) return;
    }
    const el = document.createElement('div');
    el.className = 'property-card';
    el.innerHTML = `
      <img src="${d.imagenes?.[0] || 'img/no-photo.jpg'}" alt="${d.titulo||d.nombre_comercial||''}">
      <div class="property-info">
        <h3>${d.titulo||d.nombre_comercial||'Sin título'}</h3>
        <p>${d.provincia || ''} · ${d.canton || ''} ${d.distrito? '· '+d.distrito: ''}</p>
        <p>${(d.descripcion||d.resumen||'').slice(0,120)}...</p>
        <p><strong>${d.precio ? ('₡ '+Number(d.precio).toLocaleString()) : (d.web? 'Ver negocio' : 'Consultar')}</strong></p>
        <div style="margin-top:auto"><a class="btn" href="ver-anuncio.html?id=${doc.id}">Ver</a></div>
      </div>`;
    container.appendChild(el);
  });
}
cargarTodos();

document.getElementById('btnFilter')?.addEventListener('click', ()=>{
  const prov = document.getElementById('filterProvincia')?.value;
  const canton = document.getElementById('filterCanton')?.value;
  const tipo = document.getElementById('filterTipo')?.value;
  const min = Number(document.getElementById('filterMin')?.value || 0);
  const max = Number(document.getElementById('filterMax')?.value || 0);
  filtrar(prov,canton,tipo,min,max);
});

async function filtrar(prov,canton,tipo,min,max){
  container.innerHTML='Cargando...';
  const q = query(collection(db,'anuncios'), where('estado','==','aprobado'), orderBy('fechaCreado','desc'));
  const snap = await getDocs(q);
  container.innerHTML='';
  snap.forEach(doc=>{
    const d = doc.data();
    if(d.tipo && d.tipo !== tipoPagina) return;
    if(prov && d.provincia !== prov) return;
    if(canton && d.canton !== canton) return;
    if(tipo && d.tipo_propiedad !== tipo) return;
    if(min && Number(d.precio) < min) return;
    if(max && max>0 && Number(d.precio) > max) return;
    const el = document.createElement('div');
    el.className='property-card';
    el.innerHTML = `
      <img src="${d.imagenes?.[0] || 'img/no-photo.jpg'}" alt="${d.titulo || ''}">
      <div class="property-info">
        <h3>${d.titulo || d.nombre_comercial || ''}</h3>
        <p>${d.provincia || ''} · ${d.canton || ''}</p>
        <p>${(d.descripcion||'').slice(0,120)}...</p>
        <p><strong>${d.precio ? ('₡ '+Number(d.precio).toLocaleString()) : 'Consultar'}</strong></p>
      </div>`;
    container.appendChild(el);
  });
}
