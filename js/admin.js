/* js/admin.js */
const SITE_ADMIN_EMAIL = 'crjeffrey7@gmail.com';

auth.onAuthStateChanged(async (user)=>{
  if(!user){ document.getElementById('adminArea').style.display='none'; return; }
  const adminDoc = await db.collection('admins').doc(user.email).get();
  if(!adminDoc.exists){ document.getElementById('adminArea').style.display='none'; return; }
  document.getElementById('adminArea').style.display='block';
  cargarPendientes();
  cargarEstadisticas();
});

async function cargarPendientes(){
  const el = document.getElementById('listAdmin');
  el.innerHTML = '<p>Cargando...</p>';
  const cols = ['alquileres','ventas','anunciosComerciales'];
  let all = [];
  for(const c of cols){
    const snap = await db.collection(c).where('estado','==','pendiente').orderBy('createdAt','desc').get();
    snap.forEach(d=> all.push({ coleccion: c, id: d.id, ...d.data() }));
  }
  if(!all.length){ el.innerHTML = '<p>No hay pendientes.</p>'; return; }
  el.innerHTML = all.map(i=>`<div class="card"><img src="${(i.imagenes&&i.imagenes[0])||'assets/img/sin-imagen.jpg'}"><div style="padding:12px"><h3>${i.titulo||'(sin título)'}</h3><p class="small">${(i.descripcion||'').substring(0,120)}</p><p><b>Tipo:</b> ${i.coleccion}</p><div><button onclick="aprobar('${i.coleccion}','${i.id}')">Aprobar</button><button onclick="rechazar('${i.coleccion}','${i.id}')">Rechazar</button><button onclick="expirarNow('${i.coleccion}','${i.id}')">Marcar Expirado</button></div></div></div>`).join('');
}

window.aprobar = async (col,id)=>{
  await db.collection(col).doc(id).update({ estado:'aprobado' });
  cargarPendientes(); cargarEstadisticas();
};
window.rechazar = async (col,id)=>{
  await db.collection(col).doc(id).update({ estado:'rechazado' });
  cargarPendientes(); cargarEstadisticas();
};
window.expirarNow = async (col,id)=>{
  await db.collection(col).doc(id).update({ estado:'expirado', activo:false });
  cargarPendientes(); cargarEstadisticas();
};

async function cargarEstadisticas(){
  const statsEl = document.getElementById('adminStats');
  statsEl.innerHTML = '<p>Cargando estadísticas...</p>';
  const alquileres = await db.collection('alquileres').get();
  const ventas = await db.collection('ventas').get();
  const anuncios = await db.collection('anunciosComerciales').get();
  const blog = await db.collection('blog').get();
  statsEl.innerHTML = `<p>Total alquileres: ${alquileres.size} • Ventas: ${ventas.size} • Anuncios: ${anuncios.size} • Artículos: ${blog.size}</p>`;
}
