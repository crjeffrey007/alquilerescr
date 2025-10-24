/* js/usuario.js */
auth.onAuthStateChanged(async (user)=>{
  const cont = document.getElementById('mis-anuncios');
  if(!cont) return;
  if(!user){ cont.innerHTML = '<p>Inicia sesión para ver tus anuncios.</p>'; return; }
  const cols = ['alquileres','ventas','anunciosComerciales'];
  let all = [];
  for(const c of cols){
    const snap = await db.collection(c).where('uid','==',user.uid).orderBy('createdAt','desc').get();
    snap.forEach(d=> all.push({ coleccion: c, id: d.id, ...d.data() }));
  }
  if(!all.length){ cont.innerHTML = '<p>No tienes anuncios.</p>'; return; }
  cont.innerHTML = all.map(p=>`<div class="card"><img src="${(p.imagenes&&p.imagenes[0])||'assets/img/sin-imagen.jpg'}"><div style="padding:12px"><h3>${p.titulo||'(sin título)'}</h3><p>Expira: ${(p.expireAt && p.expireAt.toDate().toLocaleDateString())||'--'}</p><p>Estado: ${p.estado||'--'}</p><div><button onclick="renovar('${p.coleccion}','${p.id}')">Renovar 30d</button><button onclick="toggleActivo('${p.coleccion}','${p.id}',${!p.activo})">${p.activo? 'Desactivar':'Activar'}</button><button onclick="eliminarPub('${p.coleccion}','${p.id}')">Eliminar</button></div></div></div>`).join('');
});

window.renovar = async (col,id)=>{
  const ref = db.collection(col).doc(id);
  const docSnap = await ref.get();
  const curr = (docSnap.data().expireAt && docSnap.data().expireAt.toDate()) || new Date();
  const nuevo = new Date(Math.max(Date.now(), curr.getTime()) + 30*24*60*60*1000);
  await ref.update({ expireAt: firebase.firestore.Timestamp.fromDate(nuevo) });
  alert('Renovado 30 días.');
  location.reload();
};

window.toggleActivo = async (col,id,estado)=>{
  await db.collection(col).doc(id).update({ activo: estado });
  location.reload();
};

window.eliminarPub = async (col,id)=>{
  if(!confirm('Eliminar?')) return;
  await db.collection(col).doc(id).delete();
  location.reload();
};
