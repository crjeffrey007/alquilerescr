/* js/auth.js */
document.getElementById('form-register')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const f = e.target;
  const email = f.email.value;
  const pass = f.password.value;
  try {
    await auth.createUserWithEmailAndPassword(email, pass);
    alert('Registrado.');
    location.href = 'panel-usuario.html';
  } catch(err){ alert(err.message); }
});

document.getElementById('form-login')?.addEventListener('submit', async function(e){
  e.preventDefault();
  const f = e.target;
  const email = f.email.value;
  const pass = f.password.value;
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    alert('Ingresado.');
    location.href = 'panel-usuario.html';
  } catch(err){ alert(err.message); }
});

document.getElementById('logoutBtn')?.addEventListener('click', async ()=> {
  await auth.signOut();
  location.href = 'index.html';
});
