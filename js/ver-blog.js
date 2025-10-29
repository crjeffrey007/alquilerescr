/* ver-blog.js */
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const params = new URLSearchParams(location.search);
const id = params.get('id'); // preferimos id (document id)
const postWrap = document.getElementById('postWrap');

async function cargar() {
  if (!id) { postWrap.innerHTML = '<p>Artículo no encontrado</p>'; return; }
  const docRef = db.collection('blog').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) { postWrap.innerHTML = '<p>Artículo no encontrado</p>'; return; }

  const p = doc.data();

  // Actualizar contador de visitas (atomically)
  try {
    await docRef.update({ visitas: (p.visitas||0)+1 });
  } catch(e) {
    console.warn('No se pudo actualizar contador', e);
  }

  // Meta tags SEO dinámicas
  const metaTitle = p.tituloSeo || p.titulo;
  document.getElementById('metaTitle').textContent = metaTitle;
  document.getElementById('metaDescription').setAttribute('content', p.descripcionSeo || '');
  document.getElementById('metaKeywords').setAttribute('content', (p.palabrasClave||[]).join(', '));
  document.getElementById('ogTitle').setAttribute('content', metaTitle);
  document.getElementById('ogDesc').setAttribute('content', p.descripcionSeo || '');
  if (p.imagenDestacada) {
    document.getElementById('ogImage').setAttribute('content', p.imagenDestacada);
  }

  // Render post
  postWrap.innerHTML = `
    ${p.imagenDestacada ? `<img src="${p.imagenDestacada}" class="imagen-blog">` : ''}
    <h1>${p.titulo}</h1>
    <p class="fecha">Publicado: ${new Date(p.fecha).toLocaleDateString('es-CR')}</p>
    <div class="texto">${p.contenido}</div>
  `;

  // Optionally update canonical URL if slug present (browser-only)
  if (p.slug) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${location.origin}/ver-blog.html?slug=${p.slug}&id=${id}`;
    document.head.appendChild(canonical);
    history.replaceState(null,'',`/ver-blog.html?slug=${p.slug}&id=${id}`);
  }
}

cargar();
