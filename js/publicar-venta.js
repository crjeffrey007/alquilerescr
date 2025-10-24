/* js/publicar-venta.js */
document.getElementById('form-venta')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const form = e.target;
  const files = document.getElementById('venta-fotos')?.files || [];
  const imagenes = await uploadMultipleFiles(files);
  const data = serializeForm(form);
  const expireDate = new Date(Date.now() + 30*24*60*60*1000);
  const doc = {
    ...data,
    imagenes,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    expireAt: firebase.firestore.Timestamp.fromDate(expireDate),
    estado: 'pendiente',
    activo: true,
    uid: (auth.currentUser && auth.currentUser.uid) || null
  };
  await db.collection('ventas').add(doc);

  const fd = new FormData(form);
  fd.append('images', JSON.stringify(imagenes));
  const adminSnap = await db.collection('admins').get();
  const adminEmails = []; adminSnap.forEach(d=>adminEmails.push(d.id));
  if(adminEmails.length){ fd.append('to', adminEmails.join(',')); fd.append('subject','Nuevo anuncio de Venta'); }
  await sendToWeb3Forms(fd);

  showMsg(document.getElementById('msgv'), 'Enviado. Pendiente de aprobación.');
  form.reset();
});
