// js/admin.js - admin panel actions
async function loadPending(){
  const container = document.getElementById('pendingListings');
  container.innerHTML = '';
  const cols = ['alquileres','ventas','anuncios'];
  for(const c of cols){
    const snap = await db.collection(c).where('estado','==','pendiente').get();
    snap.forEach(d=>{
      const data = d.data();
      const div = document.createElement('div');
      div.className='card';
      div.innerHTML = `<div class="card-body"><h3>${data.titulo||''}</h3><p>Tipo: ${c}</p><p>${data.descripcion?data.descripcion.slice(0,140):''}</p>
        <button onclick="approve('${c}','${d.id}','${data.email||''}')">Aprobar</button>
        <button onclick="reject('${c}','${d.id}','${data.email||''}')">Rechazar</button></div>`;
      container.appendChild(div);
    });
  }
}
async function approve(col,id,email){
  const ref = db.collection(col).doc(id);
  const exp = new Date(Date.now()+30*24*60*60*1000).toISOString();
  await ref.update({estado:'aprobado', fecha_aprobacion:new Date().toISOString(), fecha_expiracion:exp});
  notifyAdmin('YOUR_EMAILJS_SERVICE','YOUR_EMAILJS_TEMPLATE_APPROVE',{email:email});
  loadPending();
}
async function reject(col,id,email){
  await db.collection(col).doc(id).update({estado:'rechazado'});
  notifyAdmin('YOUR_EMAILJS_SERVICE','YOUR_EMAILJS_TEMPLATE_REJECT',{email:email});
  loadPending();
}
window.loadPending = loadPending;
