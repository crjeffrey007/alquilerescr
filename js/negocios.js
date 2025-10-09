import { db, storage, auth } from './firebase-config.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js';

const form = document.getElementById('formNegocio');
if(form) form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const user = auth.currentUser;
  if(!user){ alert('Debes iniciar sesión.'); return; }
  const btn = document.getElementById('btnNegocio'); btn.disabled=true; btn.textContent='Enviando...';
  try{
    const data = {
      nombre_comercial: document.getElementById('nombre_comercial').value,
      categoria_negocio: document.getElementById('categoria_negocio').value,
      provincia: document.getElementById('provincia').value,
      canton: document.getElementById('canton').value,
      distrito: document.getElementById('distrito').value,
      descripcion: document.getElementById('descripcion').value,
      telefono: document.getElementById('telefono').value,
      web: document.getElementById('web').value || '',
      estado: 'pendiente',
      creadoPor: user.uid,
      fechaCreado: new Date().toISOString()
    };
    const files = document.getElementById('imagenes').files;
    const urls = [];
    for(let f of files){
      const path = `negocios/${Date.now()}-${f.name}`;
      const sref = ref(storage, path);
      await uploadBytes(sref, f);
      urls.push(await getDownloadURL(sref));
    }
    data.imagenes = urls;
    await addDoc(collection(db,'anuncios'), data);
    alert('Negocio enviado y quedará pendiente de aprobación.');
    form.reset();
  }catch(err){ alert(err.message); }finally{ btn.disabled=false; btn.textContent='Enviar para aprobación'; }
});
