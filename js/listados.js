/* js/listados.js */
async function renderList(collection,containerId,filters={}){
  const el = document.getElementById(containerId);
  if(!window.db){ el.innerHTML = '<p>Firestore no configurado.</p>'; return; }
  el.innerHTML = '<p>Cargando...</p>';
  try{
    const snap = await db.collection(collection).where('estado','==','aprobado').orderBy('createdAt','desc').get();
    const now = new Date();
    const items = [];
    snap.forEach(doc=> {
      const d = doc.data();
      if((d.expireAt && d.expireAt.toDate() <= now) || !d.activo) return;
      if(filters.provincia && filters.provincia !== '' && d.provincia !== filters.provincia) return;
      if(filters.minPrecio && Number(d.precio) < Number(filters.minPrecio)) return;
      if(filters.maxPrecio && Number(d.precio) > Number(filters.maxPrecio)) return;
      items.push({ id: doc.id, ...d });
    });
    if(!items.length){ el.innerHTML = '<p>No hay publicaciones.</p>'; return; }
    el.innerHTML = items.map(i=>`<div class="card"><img src="${(i.imagenes&&i.imagenes[0])||'assets/img/sin-imagen.jpg'}"><div style="padding:12px"><h3>${i.titulo||i.nombre||'(sin título)'}</h3><p class="small">${(i.descripcion||'').substring(0,140)}</p><p><b>Precio:</b> ${i.precio||'--'} ${i.moneda||''}</p></div></div>`).join('');
  } catch(err){
    console.error(err);
    el.innerHTML = '<p>Error cargando listados.</p>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('list-alquileres')) renderList('alquileres','list-alquileres');
  if(document.getElementById('list-ventas')) renderList('ventas','list-ventas');
  if(document.getElementById('list-anuncios')) renderList('anunciosComerciales','list-anuncios');
});
