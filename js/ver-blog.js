// js/ver-blog.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const slug = params.get('slug');

const wrap = document.getElementById('postWrap');

async function cargar() {
  if (!id) {
    wrap.innerHTML = '<p>Artículo no encontrado</p>';
    return;
  }

  const ref = doc(db, 'blog', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    wrap.innerHTML = '<p>Artículo no encontrado</p>';
    return;
  }

  const data = snap.data();

  // No mostrar si no está activo (salvo que admin) — pública: sólo activo
  if (!data.activo) {
    wrap.innerHTML = '<p>Este artículo no está publicado.</p>';
    return;
  }

  // Actualizar contador de visitas (no crítico si falla)
  try {
    const visitas = (data.visitas || 0) + 1;
    await updateDoc(ref, { visitas });
  } catch (e) { console.warn('no se pudo actualizar visitas', e); }

  // metas SEO
  const titleSeo = data.tituloSeo || data.titulo;
  const descSeo = data.descripcionSeo || (stripHtml(data.contenido || '').slice(0,150));
  document.getElementById('metaTitle').textContent = `${titleSeo} | Alquileres CR`;
  document.getElementById('metaDescription').setAttribute('content', descSeo);
  document.getElementById('ogTitle').setAttribute('content', titleSeo);
  document.getElementById('ogDesc').setAttribute('content', descSeo);
  if (data.imagenDestacada) document.getElementById('ogImage').setAttribute('content', data.imagenDestacada);

  // render
  wrap.innerHTML = `
    ${data.imagenDestacada ? `<img src="${escapeHtmlAttr(data.imagenDestacada)}" alt="${escapeHtmlAttr(data.titulo)}" style="width:100%;border-radius:8px;margin-bottom:14px">` : ''}
    <h1>${escapeHtml(data.titulo)}</h1>
    <p class="card-meta">${escapeHtml(data.categoriaName||'')} • ${escapeHtml(data.provincia||'')}</p>
    <div class="contenido">${data.contenido}</div>
  `;

  // optional: update canonical if slug present
  if (data.slug) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${location.origin}/post.html?slug=${encodeURIComponent(data.slug)}&id=${id}`;
    document.head.appendChild(canonical);
  }
}

function stripHtml(html){ return (html||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(); }
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function escapeHtmlAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

cargar().catch(err=>{
  console.error(err);
  wrap.innerHTML = '<p>Error cargando el artículo.</p>';
});
