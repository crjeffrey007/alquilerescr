// js/publicar.js - generic form handler used by forms with data-collection attribute
// Expects firebase.js loaded, notifications.js loaded (emailjs)
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('form[data-collection]').forEach(form=>{
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const collection = form.getAttribute('data-collection');
      const user = firebase.auth().currentUser;
      if(!user){
        alert('Debes iniciar sesión para publicar.'); window.location.href='login.html'; return;
      }
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      data.uid = user.uid;
      data.email = user.email;
      data.estado = 'pendiente';
      data.fecha_publicacion = new Date().toISOString();
      data.fecha_expiracion = new Date(Date.now()+30*24*60*60*1000).toISOString();

      // upload media (images/videos/logo) - unlimited
      const mediaUrls = [];
      const files = form.querySelectorAll('input[type="file"]');
      for(const input of files){
        for(const file of input.files){
          const ref = storage.ref(collection + '/' + user.uid + '/' + Date.now() + '_' + file.name);
          await ref.put(file);
          const url = await ref.getDownloadURL();
          mediaUrls.push(url);
        }
      }
      if(mediaUrls.length) data.media = mediaUrls;

      // save
      await db.collection(collection).add(data);
      // notify admin
      notifyAdmin('YOUR_EMAILJS_SERVICE','YOUR_EMAILJS_TEMPLATE', {
        to_email: 'crjeffrey7@gmail.com',
        tipo: collection,
        titulo: data.titulo || '(sin título)',
        email: data.email || user.email
      });
      form.reset();
      alert('Tu anuncio fue enviado y está pendiente de aprobación.');
    });
  });
});
