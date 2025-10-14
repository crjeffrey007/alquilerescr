// js/panel.js - user panel
firebase.auth().onAuthStateChanged(async user=>{
  if(!user) { window.location.href='login.html'; return; }
  document.getElementById('welcome').innerText = 'Hola, ' + (user.email||'Usuario');
  await checkAndExpire(user.uid);
  loadUserListings(user.uid);
});

async function checkAndExpire(uid){
  const cols = ['alquileres','ventas','anuncios'];
  const now = new Date();
  for(const c of cols){
    const snap = await db.collection(c).where('uid','==',uid).get();
    snap.forEach(async d=>{
      const data = d.data();
      if(data.fecha_expiracion && new Date(data.fecha_expiracion) < now && data.estado !== 'expirado'){
        await db.collection(c).doc(d.id).update({estado:'expirado'});
      }
    });
  }
}

async function loadUserListings(uid){
  const container = document.getElementById('userListings');
  container.innerHTML = '';
  const cols = ['alquileres','ventas','anuncios'];
  for(const c of cols){
    const snap = await db.collection(c).where('uid','==',uid).get();
    snap.forEach(d=>{
      const data = d.data();
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `<div class="card-body"><h3>${data.titulo||'Sin título'}</h3><p>Estado: ${data.estado}</p>
      <p>Expira: ${data.fecha_expiracion? new Date(data.fecha_expiracion).toLocaleDateString():'-'}</p>
      <button onclick="renew('${c}','${d.id}')">Renovar</button>
      <button onclick="deleteAd('${c}','${d.id}')">Eliminar</button></div>`;
      container.appendChild(div);
    });
  }
}

async function renew(col,id){
  const ref = db.collection(col).doc(id);
  const newExp = new Date(Date.now()+30*24*60*60*1000).toISOString();
  await ref.update({fecha_expiracion:newExp, estado:'pendiente'});
  alert('Renovado y enviado para aprobación.');
  location.reload();
}
async function deleteAd(col,id){
  if(!confirm('Confirmar eliminar')) return;
  await db.collection(col).doc(id).delete();
  alert('Eliminado');
  location.reload();
}
