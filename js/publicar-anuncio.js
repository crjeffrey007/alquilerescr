document.getElementById('form-anuncio')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const form = e.target;
  const logoFiles = document.getElementById('logo')?.files || [];
  const imgFiles = document.getElementById('imagenes')?.files || [];
  const logos = logoFiles.length ? await uploadMultipleFiles(logoFiles) : [];
  const imagenes = imgFiles.length ? await uploadMultipleFiles(imgFiles) : [];
  const data = Object.fromEntries(new FormData(form).entries());
  const expireDate = new Date(Date.now() + 45*24*60*60*1000); // 45 días
  const doc = { ...data, imagenes: [...logos, ...imagenes], createdAt: firebase.firestore.FieldValue.serverTimestamp(), expireAt: firebase.firestore.Timestamp.fromDate(expireDate), estado: 'pendiente', activo: true, uid: (auth.currentUser && auth.currentUser.uid) || null };
  await db.collection('anunciosComerciales').add(doc);
  const fd = new FormData(form);
  fd.append('images', JSON.stringify(doc.imagenes));
  const adminSnap = await db.collection('admins').get();
  const adminEmails = []; adminSnap.forEach(d=>adminEmails.push(d.id));
  if(adminEmails.length){ fd.append('to', adminEmails.join(',')); fd.append('subject','Nuevo anuncio Comercial'); }
  await sendToWeb3Forms(fd);
  document.getElementById('msga') && (document.getElementById('msga').textContent = 'Enviado. Pendiente de aprobación.');
  form.reset();
});
