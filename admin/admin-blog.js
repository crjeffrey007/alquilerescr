// admin/js/admin-blog.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Usa la misma config que tu panel (si ya tienes ../js/firebase-admin.js que exporta config, úsalo)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "TU_MSG_ID",
  appId: "TU_APP_ID",
  measurementId: "G-XXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Inicializar Quill
const quill = new Quill('#quillEditor', { theme: 'snow', modules: { toolbar: [['bold','italic','underline'], [{ 'header': [1,2,3,false] }], ['link','image'], [{ 'list': 'ordered'}, { 'list': 'bullet' }]] } });

// Elementos
const form = document.getElementById('postForm');
const titulo = document.getElementById('titulo');
const excerpt = document.getElementById('excerpt');
const categorias = document.getElementById('categorias');
const slugInput = document.getElementById('slug');
const imagenFile = document.getElementById('imagenFile');
const previewImagen = document.getElementById('previewImagen');
const seoTitle = document.getElementById('seoTitle');
const seoDescription = document.getElementById('seoDescription');
const activo = document.getElementById('activo');
const postsTable = document.getElementById('postsTable');
const postIdInput = document.getElementById('postId');

let imagenDestURL = "";

// preview image on select
imagenFile.addEventListener('change', async (e) => {
  const f = e.target.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  previewImagen.innerHTML = `<img src="${url}" alt="preview">`;
});

// helper: generate slug
function slugify(text){
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9 -]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'');
}

// save post
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const user = auth.currentUser;
  if(!user){ alert('No hay usuario autenticado'); return; }

  const data = {
    titulo: titulo.value.trim(),
    excerpt: excerpt.value.trim(),
    categorias: categorias.value.split(',').map(s=>s.trim()).filter(Boolean),
    slug: slugInput.value.trim() || slugify(titulo.value.trim()),
    contenido: quill.root.innerHTML,
    seoTitle: seoTitle.value.trim() || titulo.value.trim(),
    seoDescription: seoDescription.value.trim() || excerpt.value.trim(),
    activo: activo.value === 'true',
    autor: user.displayName || user.email,
    autorEmail: user.email,
    uid: user.uid,
    fecha: serverTimestamp()
  };

  try{
    // Si subieron imagen, subir a Storage
    if(imagenFile.files && imagenFile.files[0]){
      const f = imagenFile.files[0];
      const storageRef = ref(storage, `blog/${Date.now()}_${f.name}`);
      const snap = await uploadBytes(storageRef, f);
      imagenDestURL = await getDownloadURL(snap.ref);
      data.imagenDestacadaURL = imagenDestURL;
    }

    // Si hay postId: actualizar
    const pid = postIdInput.value;
    if(pid){
      const docRef = doc(db,'blog', pid);
      await updateDoc(docRef, data);
      alert('Artículo actualizado');
    } else {
      await addDoc(collection(db,'blog'), data);
      alert('Artículo guardado');
    }
    form.reset();
    quill.setContents([]);
    previewImagen.innerHTML = '';
    postIdInput.value = '';
    loadPosts();
  }catch(err){
    console.error(err);
    alert('Error guardando artículo: ' + err.message);
  }
});

// cargar posts para listarlos y editar/eliminar
async function loadPosts(){
  postsTable.innerHTML = 'Cargando...';
  try {
    const snap = await getDocs(collection(db,'blog'));
    let html = '<table><thead><tr><th>Título</th><th>Autor</th><th>Publicado</th><th>Acciones</th></tr></thead><tbody>';
    snap.forEach(docu=>{
      const d = docu.data();
      const id = docu.id;
      html += `<tr>
        <td>${escapeHtml(d.titulo||'')}</td>
        <td>${escapeHtml(d.autorEmail||'')}</td>
        <td>${d.activo? 'Sí' : 'No'}</td>
        <td>
          <button onclick="editPost('${id}')" class="small-btn">Editar</button>
          <button onclick="togglePublish('${id}', ${d.activo})" class="small-btn">Activar/Desactivar</button>
          <button onclick="deletePost('${id}')" class="small-btn">Eliminar</button>
          <a href="/post.html?pid=${id}" target="_blank" class="small-btn">Ver</a>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';
    postsTable.innerHTML = html;
  } catch(err){
    postsTable.innerHTML = 'Error';
    console.error(err);
  }
}

// expose functions
window.editPost = async function(id){
  const docRef = doc(db,'blog', id);
  const snap = await getDoc(docRef);
  if(!snap.exists()){ alert('No encontrado'); return; }
  const d = snap.data();
  postIdInput.value = id;
  titulo.value = d.titulo || '';
  excerpt.value = d.excerpt || '';
  categorias.value = (d.categorias||[]).join(', ');
  slugInput.value = d.slug || '';
  seoTitle.value = d.seoTitle || '';
  seoDescription.value = d.seoDescription || '';
  activo.value = d.activo ? 'true' : 'false';
  quill.root.innerHTML = d.contenido || '';
  if(d.imagenDestacadaURL){
    previewImagen.innerHTML = `<img src="${d.imagenDestacadaURL}" alt="destacada">`;
  }
};

window.togglePublish = async function(id, cur){
  if(!confirm('Cambiar estado?')) return;
  await updateDoc(doc(db,'blog',id), { activo: !cur });
  loadPosts();
};

window.deletePost = async function(id){
  if(!confirm('Eliminar artículo?')) return;
  await deleteDoc(doc(db,'blog', id));
  loadPosts();
};

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

// preview button: open a temporary window with rendered HTML
document.getElementById('btnPreview').addEventListener('click', ()=>{
  const html = quill.root.innerHTML;
  const w = window.open('', '_blank', 'width=900,height=700');
  w.document.write(`<html><head><title>Preview</title><meta charset="utf-8"></head><body>${html}</body></html>`);
});

// load posts at start
loadPosts();
