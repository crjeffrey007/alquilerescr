import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
const id = localStorage.getItem('blogId');
if(!id){ document.body.innerHTML='<p>Artículo no seleccionado.</p>'; }
async function cargar(){ const snap = await getDoc(doc(db,'blog',id)); if(!snap.exists()){ document.body.innerHTML='<p>No encontrado</p>'; return; } const d = snap.data(); document.title = d.titulo; document.body.insertAdjacentHTML('afterbegin', `<h1>${d.titulo}</h1>`); document.body.insertAdjacentHTML('beforeend', `<div class="container"><img src="${d.imagen||'img/no-photo.jpg'}" style="width:100%;max-width:900px;display:block;margin:12px auto"><div class="form-card">${d.contenido}</div></div>`); }
cargar();
