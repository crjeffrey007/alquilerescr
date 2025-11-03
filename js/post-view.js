// js/post-view.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const params = new URLSearchParams(location.search);
const pid = params.get('pid');
const container = document.getElementById('postContainer');

async function loadPost(){
  if(!pid){ container.innerHTML = '<p>Artículo no especificado.</p>'; return; }
  const docRef = doc(db,'blog', pid);
  const snap = await getDoc(docRef);
  if(!snap.exists()){ container.innerHTML = '<p>No encontrado.</p>'; return; }
  const d = snap.data();
  document.title = d.seoTitle || d.titulo;
  container.innerHTML = `
    <h1>${sanitize(d.titulo)}</h1>
    <p><small>Por ${sanitize(d.autor)} • ${new Date(d.fecha?.seconds ? d.fecha.seconds*1000 : Date.now()).toLocaleDateString()}</small></p>
    ${d.imagenDestacadaURL ? `<img src="${d.imagenDestacadaURL}" style="max-width:100%;border-radius:8px;margin:12px 0">` : ''}
    <div>${d.contenido}</div>
  `;
}

function sanitize(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

loadPost();
