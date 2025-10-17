document.getElementById("form-alquiler").addEventListener("submit", async (e) => {
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
  const imagenes = document.getElementById("imagenes").files;
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;

  let imagenesUrls = [];
  for (let img of imagenes) {
    const ref = storage.ref().child("alquileres/" + Date.now() + "_" + img.name);
    await ref.put(img);
    const url = await ref.getDownloadURL();
    imagenesUrls.push(url);
  }

  await db.collection("alquileres").add({
    uid: user.uid,
    titulo,
    descripcion,
    nombre,
    email,
    imagenes: imagenesUrls,
    estado: "pendiente",
    fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp(),
  });

  alert("Tu anuncio se envió correctamente. Será revisado antes de publicarse.");
  e.target.reset();
});
