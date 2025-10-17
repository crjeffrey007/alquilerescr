document.getElementById("form-anuncio").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Debes iniciar sesión para publicar.");
    return;
  }

  const db = firebase.firestore();
  const storage = firebase.storage();

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const categoria = document.getElementById("categoria").value;
  const ubicacion = document.getElementById("ubicacion").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;
  const nombre = document.getElementById("nombre").value;
  const imagenes = document.getElementById("imagenes").files;

  let imagenesUrls = [];
  for (let img of imagenes) {
    const ref = storage.ref().child("anunciosComerciales/" + Date.now() + "_" + img.name);
    await ref.put(img);
    const url = await ref.getDownloadURL();
    imagenesUrls.push(url);
  }

  await db.collection("anunciosComerciales").add({
    uid: user.uid,
    titulo,
    descripcion,
    categoria,
    ubicacion,
    telefono,
    email,
    nombre,
    imagenes: imagenesUrls,
    estado: "pendiente",
    fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp(),
  });

  alert("Tu anuncio se ha enviado y será revisado antes de publicarse.");
  e.target.reset();
});
