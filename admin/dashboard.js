import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sidebarLinks = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('.panel-section');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;
let userRole = 'usuario';

function showSection(id){
  sections.forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
}

// navigation
sidebarLinks.forEach(link=>{
  link.addEventListener('click', (e)=>{
    e.preventDefault();
    sidebarLinks.forEach(l=>l.classList.remove('active'));
    link.classList.add('active');
    const sec = link.getAttribute('data-section');
    showSection(sec);
    // load content for section
    if(sec==='anuncios') loadCollection('anuncios', 'anunciosContent');
    if(sec==='alquileres') loadCollection('alquileres', 'alquileresContent');
    if(sec==='ventas') loadCollection('ventas', 'ventasContent');
    if(sec==='blog') loadCollection('blog', 'blogContent');
    if(sec==='usuarios') loadUsuarios();
    if(sec==='analytics') { /* analytics handled by analytics.js */ }
  });
});

// auth guard
onAuthStateChanged(auth, async (user)=>{
  if(!user) {
    window.location.href = '/login.html';
    return;
  }
  currentUser = user;
  // read role from usuarios collection
  const userRef = doc(db, 'usuarios', user.uid);
  const snap = await getDoc(userRef);
  if(snap.exists()){
    userRole = snap.data().rol || 'usuario';
    if(userRole !== 'admin'){
      document.querySelectorAll('.admin-only').forEach(el=>el.style.display='none');
    }
  } else {
    // if no user doc, treat as basic user
    document.querySelectorAll('.admin-only').forEach(el=>el.style.display='none');
  }
  // show default summary
  loadSummaryCards();
});

// logout
logoutBtn.addEventListener('click', async ()=>{
  await signOut(auth);
  window.location.href = '/login.html';
});

// load collection generic
async function loadCollection(colName, containerId){
  const container = document.getElementById(containerId);
  container.innerHTML = '<p>Cargando...</p>';
  const snap = await getDocs(collection(db, colName));
  let html = '<table><thead><tr><th>Título</th><th>Autor</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
  snap.forEach(docu=>{
    const d = docu.data();
    // if user, show only own
    if(userRole==='usuario' && d.uid && d.uid !== currentUser.uid) return;
    html += `<tr>
      <td>${escapeHtml(d.titulo||d.nombreNegocio||'Sin título')}</td>
      <td>${escapeHtml(d.autor || d.nombre || d.email || 'N/D')}</td>
      <td>${d.activo ? 'Activo' : 'Pendiente'}</td>
      <td>
        ${userRole==='admin'?`<button class="small" onclick="toggleState('${colName}','${docu.id}', ${d.activo})">Activar/Desactivar</button>`:''}
        <button class="small" onclick="deleteItem('${colName}','${docu.id}')">Eliminar</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

// summary cards
async function loadSummaryCards(){
  const cards = document.getElementById('summaryCards');
  cards.innerHTML = '<div class="card">Cargando...</div>';
  try {
    const anunciosSnap = await getDocs(collection(db,'anuncios'));
    const alquileresSnap = await getDocs(collection(db,'alquileres'));
    const ventasSnap = await getDocs(collection(db,'ventas'));
    const blogSnap = await getDocs(collection(db,'blog'));
    cards.innerHTML = `
      <div class="card"><h3>Anuncios</h3><p>${anunciosSnap.size}</p></div>
      <div class="card"><h3>Alquileres</h3><p>${alquileresSnap.size}</p></div>
      <div class="card"><h3>Ventas</h3><p>${ventasSnap.size}</p></div>
      <div class="card"><h3>Artículos</h3><p>${blogSnap.size}</p></div>
    `;
  } catch(e){
    cards.innerHTML = '<div class="card">Error cargando resumen</div>';
    console.error(e);
  }
}

// users
async function loadUsuarios(){
  if(userRole!=='admin') { document.getElementById('usuariosContent').innerHTML = '<p>Acceso denegado</p>'; return; }
  const container = document.getElementById('usuariosContent');
  container.innerHTML = '<p>Cargando...</p>';
  const snap = await getDocs(collection(db,'usuarios'));
  let html = '<table><thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>';
  snap.forEach(docu=>{
    const d = docu.data();
    html += `<tr><td>${escapeHtml(d.nombre||'')}</td><td>${escapeHtml(d.email||'')}</td><td>${escapeHtml(d.rol||'usuario')}</td><td></td></tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

// expose functions to window
window.toggleState = async function(col, id, currentState){
  if(!confirm('¿Cambiar estado?')) return;
  const ref = doc(db, col, id);
  await updateDoc(ref, { activo: !currentState });
  loadCollection(col, col+'Content');
};
window.deleteItem = async function(col, id){
  if(!confirm('¿Eliminar?')) return;
  await deleteDoc(doc(db, col, id));
  loadCollection(col, col+'Content');
};

// helpers
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
