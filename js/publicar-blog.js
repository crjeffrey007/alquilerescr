document.getElementById('form-blog')?.addEventListener('submit', async function(e){
  e.preventDefault();
  if(!auth.currentUser) return alert('Inicia sesión como admin');
  const data = Object.fromEntries(new FormData(e.target).entries());
  const doc = { ...data, categoria: data.categoria || 'Recomendaciones', createdAt: firebase.firestore.FieldValue.serverTimestamp(), uid: auth.currentUser.uid };
  await db.collection('blog').add(doc);
  document.getElementById('msgb') && (document.getElementById('msgb').textContent = 'Artículo publicado.');
  e.target.reset();
});
