import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';

const container = document.getElementById('blogContainer');
async function cargar(){
  const q = query(collection(db,'blog'), orderBy('fecha','desc'));
  const snap = await getDocs(q);
  container.innerHTML='';
  snap.forEach(doc=>{
    const d = doc.data();
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `<img src="${d.imagen||'img/no-photo.jpg'}" style="width:100%;height:180px;object-fit:cover"><div style="padding:12px"><h3>${d.titulo}</h3><p style="color:#666">${d.categoria}</p><p>${(d.resumen||d.contenido||'').slice(0,120)}...</p><button class="btn" onclick="ver('${doc.id}')">Leer</button></div>`;
    container.appendChild(card);
  });
}
window.ver = (id)=>{ localStorage.setItem('blogId',id); location.href='ver-articulo.html'; };
cargar();
