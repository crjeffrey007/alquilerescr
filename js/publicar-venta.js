document.getElementById("form-venta").addEventListener("submit", async (e) => {
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
  const precio = document.getElementById("precio").value;
  const moneda = document.getElementById("moneda").value;
  const imagenes = document.getElementById("imagenes").files;
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;

  let imagenesUrls = [];
  for (let img of imagenes) {
    const ref = storage.ref().child("ventas/" + Date.now() + "_" + img.name);
    await ref.put(img);
    const url = await ref.getDownloadURL();
    imagenesUrls.push(url);
  }

  await db.collection("ventas").add({
    uid: user.uid,
    titulo,
    descripcion,
    precio,
    moneda,
    nombre,
    email,
    telefono,
    imagenes: imagenesUrls,
    estado: "pendiente",
    fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp(),
  });

  alert("Tu anuncio fue enviado correctamente. Será revisado antes de publicarse.");
  e.target.reset();
});
