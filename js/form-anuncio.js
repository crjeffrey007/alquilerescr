document.getElementById("form-anuncio").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "Subiendo información...";

  // Subir logo
  const logoFile = document.getElementById("logo").files[0];
  let logoUrl = "";
  if (logoFile) {
    const refLogo = storage.ref(`anuncios/logos/${Date.now()}_${logoFile.name}`);
    await refLogo.put(logoFile);
    logoUrl = await refLogo.getDownloadURL();
  }

  // Subir imágenes
  const imagenes = document.getElementById("imagenes").files;
  const urls = [];

  for (let img of imagenes) {
    const ref = storage.ref(`anuncios/${Date.now()}_${img.name}`);
    await ref.put(img);
    const url = await ref.getDownloadURL();
    urls.push(url);
  }

  await db.collection("anuncios").add({
    tipo: document.getElementById("tipo").value,
    titulo: document.getElementById("titulo").value,
    descripcion: document.getElementById("descripcion").value,
    nombre_negocio: document.getElementById("nombre_negocio").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    logo: logoUrl,
    imagenes: urls,
    nombre: document.getElementById("nombre").value,
    horario: document.getElementById("horario").value,
    direccion: document.getElementById("direccion").value,
    provincia: document.getElementById("provincia").value,
    pais: document.getElementById("pais").value,
    servicio_domicilio: document.getElementById("servicio_domicilio").value,
    veridico: document.getElementById("veridico").checked,
    estado: "pendiente",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  mensaje.textContent = "¡Anuncio enviado! Quedará pendiente de revisión.";
  document.getElementById("form-anuncio").reset();
});
