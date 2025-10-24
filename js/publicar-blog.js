/* js/publicar-blog.js */
document.getElementById('form-blog')?.addEventListener('submit', async function(e){
  e.preventDefault();
  if(!auth.currentUser) return alert('Inicia sesión como admin');
  const data = serializeForm(e.target);
  const doc = {
    ...data,
    categoria: data.categoria || 'Recomendaciones',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid: auth.currentUser.uid
  };
  await db.collection('blog').add(doc);
  showMsg(document.getElementById('msgb'),'Artículo publicado.');
  e.target.reset();
});
