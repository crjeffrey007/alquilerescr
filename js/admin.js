const ADMIN_EMAIL = 'crjeffrey7@gmail.com';
async function cargarPendientes(){
  const el = document.getElementById('listAdmin'); el.innerHTML = '<p>Cargando...</p>';
  const cols = ['alquileres','ventas','anunciosComerciales']; let all = [];
  for (const c of cols){
    const snap = await db.collection(c).where('estado','==','pendiente').orderBy('createdAt','desc').get();
    snap.forEach(doc => all.push({ id: doc.id, coleccion: c, ...doc.data() }));
  }
  if (!all.length) { el.innerHTML = '<p>No hay pendientes.</p>'; return; }
  el.innerHTML = all.map(i=>`<div class="card"><img src="${(i.imagenes&&i.imagenes[0])||'img/sin-imagen.jpg'}"><div class="body"><h3>${i.titulo||i.nombre||'(sin título)'}</h3><p>${(i.descripcion||'').substring(0,120)}</p><div class="acciones"><button onclick="aprobar('${i.coleccion}','${i.id}')">Aprobar</button><button onclick="rechazar('${i.coleccion}','${i.id}')">Rechazar</button><button onclick="expirarNow('${i.coleccion}','${i.id}')">Marcar Expirado</button></div></div></div>`).join('');
}
window.aprobar = async (col,id) => { await db.collection(col).doc(id).update({ estado: 'aprobado' }); cargarPendientes(); };
window.rechazar = async (col,id) => { await db.collection(col).doc(id).update({ estado: 'rechazado' }); cargarPendientes(); };
window.expirarNow = async (col,id) => { await db.collection(col).doc(id).update({ estado: 'expirado', activo:false }); cargarPendientes(); };
auth.onAuthStateChanged(user => {
  if (!user || user.email !== ADMIN_EMAIL) {
    document.getElementById('adminArea').style.display = 'none';
  } else {
    document.getElementById('adminArea').style.display = 'block';
    cargarPendientes();
  }
});
