// js/caducidad.js - check expirations (can be included in admin or a cron Cloud Function)
async function revisarCaducidad(){
  const cols = ['alquileres','ventas','anuncios'];
  const now = new Date();
  for(const c of cols){
    const snap = await db.collection(c).where('estado','==','aprobado').get();
    snap.forEach(async d=>{
      const data = d.data();
      if(data.fecha_expiracion && new Date(data.fecha_expiracion) < now){
        await db.collection(c).doc(d.id).update({estado:'expirado'});
      }
    });
  }
  console.log('Revisión de caducidad completa');
}
revisarCaducidad();
// also re-run every 24h
setInterval(revisarCaducidad, 24*60*60*1000);
