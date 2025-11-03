// js/blog-listing.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "TU_MSG_ID",
  appId: "TU_APP_ID"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

let posts = [];

async function loadPosts(){
  postsContainer.innerHTML = 'Cargando...';
  const q = query(collection(db,'blog'), orderBy('fecha','desc'));
  const snap = await getDocs(q);
  posts = [];
  const categoriesSet = new Set();
  snap.forEach(docu=>{
    const d = docu.data();
    if(!d.activo) return; // sólo publicados
    posts.push({ id: docu.id, ...d });
    (d.categorias||[]).forEach(c=>categoriesSet.add(c));
  });
  renderCategories(Array.from(categoriesSet));
  renderPosts(posts);
}

function renderCategories(list){
  categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
  list.forEach(c=>{
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c; categoryFilter.appendChild(opt);
  });
}

function renderPosts(list){
  if(list.length === 0){ postsContainer.innerHTML = '<p>No hay artículos.</p>'; return; }
  postsContainer.innerHTML = list.map(p=>`
    <article class="post-card">
      ${p.imagenDestacadaURL? `<img src="${p.imagenDestacadaURL}" alt="${p.titulo}">` : ''}
      <h2><a href="/post.html?pid=${p.id}">${p.titulo}</a></h2>
      <p><small>Por ${p.autor} • ${new Date(p.fecha?.seconds ? p.fecha.seconds*1000 : Date.now()).toLocaleDateString()}</small></p>
      <p>${p.excerpt || stripHtml(p.contenido).slice(0,180) }...</p>
      <p><a href="/post.html?pid=${p.id}">Leer más →</a></p>
    </article>
  `).join('');
}

function stripHtml(html){ const tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ''; }

// filters
searchInput.addEventListener('input', ()=>applyFilters());
categoryFilter.addEventListener('change', ()=>applyFilters());

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;
  const filtered = posts.filter(p=>{
    const matchesQ = !q || (p.titulo && p.titulo.toLowerCase().includes(q)) || (p.contenido && stripHtml(p.contenido).toLowerCase().includes(q));
    const matchesCat = !cat || (p.categorias || []).includes(cat);
    return matchesQ && matchesCat;
  });
  renderPosts(filtered);
}

loadPosts();
