/******************************
 * admin-blog.js
 * Copia este archivo a /js/admin-blog.js
 ******************************/

/* ========== CONFIG - reemplaza estos valores ========== */
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MSG_ID",
  appId: "TU_APP_ID"
};
const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "TU_UPLOAD_PRESET";
/* ===================================================== */

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// UI refs
const authWrap = document.getElementById("authWrap");
const panel = document.getElementById("panel");

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const btnSignIn = document.getElementById("btnSignIn");
const btnSignUp = document.getElementById("btnSignUp");
const btnGoogle = document.getElementById("btnGoogle");

const btnLogout = document.getElementById("btnLogout");
const btnNew = document.getElementById("btnNew");

const editorSection = document.getElementById("editorSection");
const editorTitle = document.getElementById("editorTitle");
const btnCancel = document.getElementById("btnCancel");
const btnSave = document.getElementById("btnSave");

const postTitle = document.getElementById("postTitle");
const postTitleSeo = document.getElementById("postTitleSeo");
const postDescriptionSeo = document.getElementById("postDescriptionSeo");
const postKeywords = document.getElementById("postKeywords");
const postSlug = document.getElementById("postSlug");
const postCategory = document.getElementById("postCategory");
const newCategoryInput = document.getElementById("newCategoryInput");
const btnAddCategory = document.getElementById("btnAddCategory");
const btnUploadImages = document.getElementById("btnUploadImages");
const previewImages = document.getElementById("previewImages");
const btnUploadFeatured = document.getElementById("btnUploadFeatured");
const previewFeatured = document.getElementById("previewFeatured");
const postActive = document.getElementById("postActive");
const postsList = document.getElementById("postsList");
const searchTitle = document.getElementById("searchTitle");
const filterDateFrom = document.getElementById("filterDateFrom");
const filterDateTo = document.getElementById("filterDateTo");
const btnApplyFilter = document.getElementById("btnApplyFilter");
const btnClear = document.getElementById("btnClear");

let quill;
let currentImages = []; // array urls
let featuredImage = "";
let categories = [];
let postsCache = [];
let editingId = null;

// ---------- Quill init ----------
quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Escribe el contenido...',
  modules: {
    toolbar: [
      [{ header: [1,2,3,false] }],
      ['bold','italic','underline','strike'],
      ['blockquote','code-block'],
      [{ list: 'ordered'}, { list: 'bullet' }],
      ['link','image'],
      [{ 'align': [] }],
      ['clean']
    ]
  }
});

// ---------- Auth flows ----------
btnSignIn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  if (!email || !pass) return alert('Email y contraseña requeridos');
  auth.signInWithEmailAndPassword(email, pass).catch(e => alert(e.message));
});

btnSignUp.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  if (!email || !pass) return alert('Email y contraseña requeridos');
  auth.createUserWithEmailAndPassword(email, pass)
    .then(cred => {
      // opcional: marcar este usuario en collection admins (sólo para tu uso)
      // db.collection('admins').doc(cred.user.uid).set({ email });
      alert('Cuenta creada. Pide que te agregue como admin (añadir email a la colección admins en Firestore).');
    })
    .catch(e => alert(e.message));
});

btnGoogle.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(e => alert(e.message));
});

btnLogout.addEventListener('click', () => auth.signOut());

// ---------- Protect panel: only admins ----------
auth.onAuthStateChanged(async user => {
  if (!user) {
    // show auth
    authWrap.style.display = 'flex';
    panel.classList.add('hidden');
    return;
  }

  // check if user is admin: look up in collection 'admins' by email or uid
  const q = await db.collection('admins').where('email','==', user.email).get();
  if (q.empty) {
    // not admin
    alert('Acceso denegado: su cuenta no es admin.');
    auth.signOut();
    return;
  }

  // ok admin
  authWrap.style.display = 'none';
  panel.classList.remove('hidden');
  loadInitialData();
});

// ---------- load categories & listen posts ----------
async function loadInitialData() {
  await loadCategories();
  listenPosts();
}

async function loadCategories() {
  const snap = await db.collection('blog_categories').orderBy('name').get();
  categories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderCategoryOptions();
}

function renderCategoryOptions() {
  postCategory.innerHTML =
    `<option value="">-- Seleccionar categoría --</option>` +
    categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

btnAddCategory.addEventListener('click', async () => {
  const name = newCategoryInput.value.trim();
  if (!name) return alert('Ingresa nombre de categoría');
  const doc = await db.collection('blog_categories').add({ name });
  categories.push({ id: doc.id, name });
  renderCategoryOptions();
  newCategoryInput.value = '';
});

// ---------- listen posts ----------
function listenPosts() {
  db.collection('blog').orderBy('fecha','desc').onSnapshot(snap => {
    postsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderPosts(postsCache);
  });
}

function renderPosts(list) {
  postsList.innerHTML = '';
  if (!list.length) {
    postsList.innerHTML = '<tr><td colspan="6">No hay artículos</td></tr>';
    return;
  }
  list.forEach(p => {
    const tr = document.createElement('tr');
    const cat = categories.find(c => c.id===p.categoriaId)?.name || p.categoriaName || '-';
    const visitas = p.visitas || 0;
    tr.innerHTML = `
      <td>${escapeHtml(p.titulo)}</td>
      <td>${escapeHtml(p.slug || '')}</td>
      <td>${escapeHtml(cat)}</td>
      <td>${p.activo ? 'Sí' : 'No'}</td>
      <td>${visitas}</td>
      <td>
        <button class="btn btn-sm" data-id="${p.id}" data-action="view">👁</button>
        <button class="btn btn-sm" data-id="${p.id}" data-action="edit">✏</button>
        <button class="btn btn-sm" data-id="${p.id}" data-action="toggle">${p.activo ? 'Ocultar' : 'Publicar'}</button>
        <button class="btn btn-sm btn-danger" data-id="${p.id}" data-action="delete">🗑</button>
      </td>
    `;
    postsList.appendChild(tr);
  });

  // attach handlers
  postsList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if (action==='view') window.open(`../ver-blog.html?id=${id}`,'_blank');
      if (action==='edit') editPost(id);
      if (action==='delete') deletePost(id);
      if (action==='toggle') togglePublish(id);
    });
  });
}

// ---------- New / Edit flow ----------
btnNew.addEventListener('click', () => openEditor());
btnCancel.addEventListener('click', () => closeEditor());

function openEditor(post=null) {
  editorSection.classList.remove('hidden');
  if (!post) {
    editingId = null;
    postTitle.value = '';
    postTitleSeo.value = '';
    postDescriptionSeo.value = '';
    postKeywords.value = '';
    postSlug.value = '';
    postCategory.value = '';
    quill.setText('');
    currentImages = [];
    featuredImage = '';
    renderPreviewImages();
    previewFeatured.innerHTML = '';
    postActive.checked = false;
    editorTitle.textContent = 'Nuevo artículo';
    return;
  }
  // fill form
  editingId = post.id;
  postTitle.value = post.titulo || '';
  postTitleSeo.value = post.tituloSeo || '';
  postDescriptionSeo.value = post.descripcionSeo || '';
  postKeywords.value = (post.palabrasClave || []).join(', ');
  postSlug.value = post.slug || '';
  postCategory.value = post.categoriaId || '';
  quill.root.innerHTML = post.contenido || '';
  currentImages = post.imagenes || [];
  featuredImage = post.imagenDestacada || '';
  renderPreviewImages();
  previewFeatured.innerHTML = featuredImage ? `<img src="${featuredImage}" style="max-height:140px;border-radius:8px;">` : '';
  postActive.checked = !!post.activo;
  editorTitle.textContent = 'Editar artículo';
}

async function editPost(id) {
  const doc = await db.collection('blog').doc(id).get();
  if (!doc.exists) return alert('No existe');
  openEditor({ id: doc.id, ...doc.data() });
}

async function deletePost(id) {
  if (!confirm('Eliminar artículo?')) return;
  await db.collection('blog').doc(id).delete();
  alert('Eliminado');
}

async function togglePublish(id) {
  const doc = await db.collection('blog').doc(id).get();
  if (!doc.exists) return;
  const actual = doc.data().activo || false;
  await db.collection('blog').doc(id).update({ activo: !actual });
  alert(`Artículo ${!actual ? 'publicado' : 'ocultado'}`);
}

// ---------- Save ----------
btnSave.addEventListener('click', async () => {
  const titulo = postTitle.value.trim();
  const tituloSeo = postTitleSeo.value.trim();
  const descripcionSeo = postDescriptionSeo.value.trim();
  const keywords = postKeywords.value.split(',').map(s=>s.trim()).filter(Boolean);
  let slug = postSlug.value.trim();
  const categoriaId = postCategory.value;
  const contenido = quill.root.innerHTML;

  if (!titulo || !contenido || !categoriaId) return alert('Completa título, contenido y categoría');

  // slug auto si no hay
  if (!slug) slug = generateSlug(titulo);
  // make unique by appending timestamp when creating new (optional)
  if (!editingId) slug += '-' + Date.now().toString().slice(-4);

  const data = {
    titulo,
    tituloSeo: tituloSeo || titulo,
    descripcionSeo,
    palabrasClave: keywords,
    slug,
    categoriaId,
    contenido,
    imagenes: currentImages,
    imagenDestacada: featuredImage,
    activo: !!postActive.checked,
    fecha: new Date().toISOString(),
    visitas: (editingId ? (await (await db.collection('blog').doc(editingId).get()).data()?.visitas) : 0) || 0,
    autorUid: auth.currentUser.uid,
    autorEmail: auth.currentUser.email
  };

  try {
    if (editingId) {
      await db.collection('blog').doc(editingId).update(data);
      alert('Artículo actualizado');
    } else {
      await db.collection('blog').add(data);
      alert('Artículo creado');
    }
    closeEditor();
  } catch (err) {
    console.error(err);
    alert('Error guardando');
  }
});

function closeEditor() {
  editorSection.classList.add('hidden');
}

// ---------- Cloudinary uploads ----------
btnUploadImages.addEventListener('click', () => {
  cloudinary.openUploadWidget({
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    sources: ['local','camera'],
    multiple: true,
    folder: 'blog'
  }, (err, result) => {
    if (!err && result && result.event === 'success') {
      currentImages.push(result.info.secure_url);
      renderPreviewImages();
    }
  });
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
      featuredImage = result.info.secure_url;
      previewFeatured.innerHTML = `<img src="${featuredImage}" style="max-height:140px;border-radius:8px;">`;
    }
  });
});

function renderPreviewImages() {
  previewImages.innerHTML = currentImages.map((u, i) => `
    <div class="img-wrap">
      <img src="${u}" alt="img${i}">
      <button class="remove-img" data-i="${i}">✖</button>
    </div>
  `).join('');
  // attach handlers
  previewImages.querySelectorAll('.remove-img').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-i'));
      currentImages.splice(idx,1);
      renderPreviewImages();
    });
  });
}

// ---------- Search & Filter ----------
searchTitle.addEventListener('input', applyFilters);
btnApplyFilter.addEventListener('click', applyFilters);
btnClear.addEventListener('click', () => {
  searchTitle.value = '';
  filterDateFrom.value = '';
  filterDateTo.value = '';
  renderPosts(postsCache);
});

function applyFilters() {
  const text = (searchTitle.value||'').toLowerCase();
  const from = filterDateFrom.value ? new Date(filterDateFrom.value) : null;
  const to = filterDateTo.value ? new Date(filterDateTo.value) : null;
  const filtered = postsCache.filter(p => {
    const titleMatch = p.titulo.toLowerCase().includes(text);
    const fecha = p.fecha ? new Date(p.fecha) : null;
    const dateMatch = (!from || (fecha && fecha >= from)) && (!to || (fecha && fecha <= to));
    return titleMatch && dateMatch;
  });
  renderPosts(filtered);
}

// ---------- Helpers ----------
function generateSlug(text) {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // accents
    .replace(/[^a-z0-9 -]/g,'') // remove invalid
    .replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'');
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s]);
}

// ---------- init UI ----------
(function init(){
  authWrap.style.display = 'flex';
  panel.classList.add('hidden');
  editorSection.classList.add('hidden');
})();
