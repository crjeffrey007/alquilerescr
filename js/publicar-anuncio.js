import { db, storage, auth } from './firebase-config.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js';

const form = document.getElementById('formAnuncio');
if(form) form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const user = auth.currentUser;
  if(!user){ alert('Debes iniciar sesión para publicar.'); return; }
  const btn = document.getElementById('btnSubmit');
  btn.disabled = true; btn.textContent = 'Enviando...';
  try{
    const data = {
      tipo: document.getElementById('tipo').value,
      titulo: document.getElementById('titulo').value,
      provincia: document.getElementById('provincia').value,
      canton: document.getElementById('canton').value,
      distrito: document.getElementById('distrito').value,
      precio: Number(document.getElementById('precio').value) || null,
      tipo_propiedad: document.getElementById('tipo_propiedad').value,
      habitaciones: Number(document.getElementById('habitaciones').value) || 0,
      banos: Number(document.getElementById('banos').value) || 0,
      amueblado: document.getElementById('amueblado').value,
      mascotas: document.getElementById('mascotas').value,
      descripcion: document.getElementById('descripcion').value,
      mapa: document.getElementById('mapa').value || '',
      telefono: document.getElementById('telefono').value,
      estado: 'pendiente',
      creadoPor: user.uid,
      fechaCreado: new Date().toISOString()
    };
    const files = document.getElementById('imagenes').files;
    const urls = [];
    for (let f of files){
      const path = `anuncios/${Date.now()}-${f.name}`;
      const sref = ref(storage, path);
      await uploadBytes(sref, f);
      const url = await getDownloadURL(sref);
      urls.push(url);
    }
    data.imagenes = urls;
    await addDoc(collection(db,'anuncios'), data);
    document.getElementById('msg').textContent = 'Anuncio enviado y pendiente de aprobación.';
    form.reset();
  }catch(err){
    alert(err.message);
  }finally{
    btn.disabled = false; btn.textContent = 'Enviar para aprobación';
  }
});
