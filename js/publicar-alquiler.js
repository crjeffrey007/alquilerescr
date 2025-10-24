document.getElementById('form-alquiler')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const form = e.target;
  const files = document.getElementById('alquiler-fotos')?.files || [];
  const imagenes = await uploadMultipleFiles(files);
  const data = Object.fromEntries(new FormData(form).entries());
  const expireDate = new Date(Date.now() + 45*24*60*60*1000); // 45 días
  const doc = { ...data, imagenes, createdAt: firebase.firestore.FieldValue.serverTimestamp(), expireAt: firebase.firestore.Timestamp.fromDate(expireDate), estado: 'pendiente', activo: true, uid: (auth.currentUser && auth.currentUser.uid) || null, emailUsuario: (auth.currentUser && auth.currentUser.email) || data.email || '' };
  await db.collection('alquileres').add(doc);
  // Notificación via Web3Forms
  const fd = new FormData(form);
  fd.append('images', JSON.stringify(imagenes));
  const adminSnap = await db.collection('admins').get();
  const adminEmails = []; adminSnap.forEach(d=>adminEmails.push(d.id));
  if(adminEmails.length){ fd.append('to', adminEmails.join(',')); fd.append('subject','Nuevo anuncio de Alquiler'); }
  await sendToWeb3Forms(fd);
  document.getElementById('msg') && (document.getElementById('msg').textContent = 'Enviado. Pendiente de aprobación.');
  form.reset();
});
