// Reemplaza con tu correo de administrador:
const adminEmail = "crjeffrey7@gmail.com";

firebase.auth().onAuthStateChanged(user => {
  const form = document.getElementById("form-blog");
  const noAccess = document.getElementById("no-access");

  if (user && user.email === adminEmail) {
    form.style.display = "block";
  } else {
    noAccess.style.display = "block";
  }
});

document.getElementById("form-blog").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "Subiendo artículo...";

  let imagenUrl = "";
  const imagen = document.getElementById("imagen").files[0];
  if (imagen) {
    const ref = storage.ref(`blog/${Date.now()}_${imagen.name}`);
    await ref.put(imagen);
    imagenUrl = await ref.getDownloadURL();
  }

  await db.collection("blog").add({
    titulo: document.getElementById("titulo").value,
    contenido: document.getElementById("contenido").value,
    categoria: document.getElementById("categoria").value,
    imagen: imagenUrl,
    autor: firebase.auth().currentUser.email,
    fecha: firebase.firestore.FieldValue.serverTimestamp()
  });

  mensaje.textContent = "✅ Artículo publicado con éxito.";
  document.getElementById("form-blog").reset();
});
