import { db, auth } from './firebase-config.js';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js';

const pend = document.getElementById('pendientes');
const ap = document.getElementById('aprobados');
const ADMIN_UID = 'TU_UID_ADMIN'; // reemplaza por tu UID

onAuthStateChanged(auth, async (user)=>{
  if(!user) { alert('Debes iniciar sesión como admin'); location.href='login.html'; return; }
  if(user.uid !== ADMIN_UID){ alert('No autorizado'); location.href='login.html'; return; }
  cargar();
});

async function cargar(){
  pend.innerHTML='Cargando...'; ap.innerHTML='Cargando...';
  const snap = await getDocs(collection(db,'anuncios'));
  pend.innerHTML=''; ap.innerHTML='';
  snap.forEach(s=>{
    const d = s.data(); const id=s.id;
    const node = document.createElement('div');
    node.className='pending-item';
    node.innerHTML = `<div style="flex:1"><strong>${d.titulo||d.nombre_comercial||'Sin título'}</strong><div style="color:#666">${d.provincia||''} · ${d.canton||''}</div></div>
      <div>
        ${d.estado === 'pendiente' ? `<button id="ap-${id}" class="btn">Aprobar</button>` : `<button id="re-${id}" class="btn">Rechazar</button>`}
        <button id="del-${id}" style="margin-left:6px">Eliminar</button>
      </div>`;
    if(d.estado==='pendiente') pend.appendChild(node); else ap.appendChild(node);

    document.getElementById(`ap-${id}`)?.addEventListener('click', async ()=>{ await updateDoc(doc(db,'anuncios',id),{estado:'aprobado'}); cargar(); });
    document.getElementById(`re-${id}`)?.addEventListener('click', async ()=>{ await updateDoc(doc(db,'anuncios',id),{estado:'rechazado'}); cargar(); });
    document.getElementById(`del-${id}`)?.addEventListener('click', async ()=>{ if(confirm('Eliminar?')){ await deleteDoc(doc(db,'anuncios',id)); cargar(); } });
  });
}
