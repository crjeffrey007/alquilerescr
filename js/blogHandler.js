document.getElementById("blogForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const file = formData.get("imagen_destacada");

  try {
    const ref = storage.ref(`blog/${Date.now()}_${file.name}`);
    await ref.put(file);
    const url = await ref.getDownloadURL();

    await db.collection("blog").add({
      ...data,
      imagen_destacada: url,
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("✅ Artículo publicado correctamente.");
    form.reset();
  } catch (err) {
    alert("❌ Error al publicar: " + err.message);
  }
});
