import { db, storage, auth } from './firebase-config.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js';

const form = document.getElementById('formBlog');
if(form) form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const user = auth.currentUser;
  if(!user) return alert('Inicia sesión como admin');
  let url='';
  if(form.imagen.files.length){
    const f = form.imagen.files[0];
    const sref = ref(storage, `blog/${Date.now()}-${f.name}`);
    await uploadBytes(sref,f);
    url = await getDownloadURL(sref);
  }
  await addDoc(collection(db,'blog'), {
    titulo: form.titulo.value,
    categoria: form.categoria.value,
    resumen: form.resumen.value,
    contenido: form.contenido.value,
    imagen: url,
    fecha: new Date().toISOString()
  });
  alert('Artículo publicado');
  form.reset();
});
