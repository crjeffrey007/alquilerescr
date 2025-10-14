// js/blogHandler.js
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('blogForm');
  if(!form) return;
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.fecha = new Date().toISOString();
    data.estado = 'publicado';
    await db.collection('blog').add(data);
    alert('Artículo publicado');
    form.reset();
  });
});
