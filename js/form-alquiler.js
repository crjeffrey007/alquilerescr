document.getElementById("form-alquiler").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "Subiendo información...";

  const imagenes = document.getElementById("imagenes").files;
  const urls = [];

  for (let img of imagenes) {
    const ref = storage.ref(`alquileres/${Date.now()}_${img.name}`);
    await ref.put(img);
    const url = await ref.getDownloadURL();
    urls.push(url);
  }

  await db.collection("alquileres").add({
    titulo: document.getElementById("titulo").value,
    descripcion: document.getElementById("descripcion").value,
    area: document.getElementById("area").value,
    construccion: document.getElementById("construccion").value,
    amoblado: document.getElementById("amoblado").value,
    habitaciones: document.getElementById("habitaciones").value,
    banos: document.getElementById("banos").value,
    servicios_incluidos: document.getElementById("servicios_incluidos").value,
    direccion: document.getElementById("direccion").value,
    provincia: document.getElementById("provincia").value,
    pais: document.getElementById("pais").value,
    moneda: document.getElementById("moneda").value,
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    veridico: document.getElementById("veridico").checked,
    imagenes: urls,
    estado: "pendiente",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  mensaje.textContent = "¡Anuncio enviado! Quedará pendiente de revisión.";
  document.getElementById("form-alquiler").reset();
});
