// js/blog.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, collection, query, where, orderBy, getDocs
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
/* ------------------------------------------ */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const listadoEl = document.getElementById('listado');
const buscarEl = document.getElementById('buscar');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroProvincia = document.getElementById('filtroProvincia');
const paginacionEl = document.getElementById('paginacion');

let postsCache = []; // array de objetos {id, ...data}
let pagina = 1;
const POR_PAGINA = 12;

async function cargarPostsDesdeFirestore() {
  listadoEl.innerHTML = '<p>Cargando artículos...</p>';
  const q = query(collection(db, 'blog'), where('activo','==', true), orderBy('fecha','desc'));
  const snap = await getDocs(q);
  postsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  generarFiltrosDinamicos(postsCache);
  pagina = 1;
  mostrarPagina();
}

function generarFiltrosDinamicos(list) {
  const cats = new Set();
  const provs = new Set();
  list.forEach(p => {
    if (p.categoriaName) cats.add(p.categoriaName);
    if (p.provincia) provs.add(p.provincia);
  });
  // categorias
  filtroCategoria.innerHTML = '<option value="">Todas las categorías</option>' +
    Array.from(cats).map(c => `<option value="${escapeHtmlAttr(c)}">${escapeHtml(c)}</option>`).join('');
  // provincias
  filtroProvincia.innerHTML = '<option value="">Todas las provincias</option>' +
    Array.from(provs).map(p => `<option value="${escapeHtmlAttr(p)}">${escapeHtml(p)}</option>`).join('');
}

function mostrarPagina() {
  const texto = (buscarEl.value || '').toLowerCase();
  const cat = filtroCategoria.value;
  const prov = filtroProvincia.value;

  const filtrados = postsCache.filter(p => {
    const matchText = (p.titulo||'').toLowerCase().includes(texto) || (p.descripcionSeo||p.descripcion||'').toLowerCase().includes(texto);
    const matchCat = !cat || (p.categoriaName === cat);
    const matchProv = !prov || (p.provincia === prov);
    return matchText && matchCat && matchProv;
  });

  const total = filtrados.length;
  const totalPags = Math.max(1, Math.ceil(total / POR_PAGINA));
  if (pagina > totalPags) pagina = totalPags;

  const inicio = (pagina - 1) * POR_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + POR_PAGINA);

  if (!visibles.length) {
    listadoEl.innerHTML = '<p>No se encontraron artículos.</p>';
    paginacionEl.innerHTML = '';
    return;
  }

  listadoEl.innerHTML = visibles.map(p => {
    const img = p.imagenDestacada || 'https://via.placeholder.com/800x450?text=Sin+imagen';
    const excerpt = stripHtml(p.contenido || p.descripcion || '').slice(0,160) + '...';
    // link por id y slug si existe
    const url = `post.html?id=${encodeURIComponent(p.id)}${p.slug ? `&slug=${encodeURIComponent(p.slug)}` : ''}`;
    return `
      <article class="card">
        <img loading="lazy" src="${escapeHtmlAttr(img)}" alt="${escapeHtmlAttr(p.titulo || '')}">
        <div class="card-body">
          <h3>${escapeHtml(p.titulo || '')}</h3>
          <p class="card-meta">${escapeHtml(p.categoriaName || '')} • ${escapeHtml(p.provincia || '')}</p>
          <p>${escapeHtml(excerpt)}</p>
          <a class="btn-leer" href="${url}">Leer más</a>
        </div>
      </article>
    `;
  }).join('');

  // paginación
  let pagHtml = '';
  if (pagina > 1) pagHtml += `<button data-page="${pagina-1}" class="page-btn">← Anteriores</button>`;
  pagHtml += `<span class="info">Página ${pagina} de ${totalPags}</span>`;
  if (pagina < totalPags) pagHtml += `<button data-page="${pagina+1}" class="page-btn">Siguientes →</button>`;
  paginacionEl.innerHTML = pagHtml;

  // eventos paginación
  paginacionEl.querySelectorAll('.page-btn').forEach(b => b.addEventListener('click', () => {
    pagina = Number(b.getAttribute('data-page'));
    mostrarPagina();
    window.scrollTo({top:0,behavior:'smooth'});
  }));
}

// listeners
buscarEl.addEventListener('input', () => { pagina = 1; mostrarPagina(); });
filtroCategoria.addEventListener('change', () => { pagina = 1; mostrarPagina(); });
filtroProvincia.addEventListener('change', () => { pagina = 1; mostrarPagina(); });

// helpers
function stripHtml(html){ return (html||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(); }
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function escapeHtmlAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

// iniciar
cargarPostsDesdeFirestore().catch(err=>{
  console.error(err);
  listadoEl.innerHTML = '<p>Error cargando artículos.</p>';
});
