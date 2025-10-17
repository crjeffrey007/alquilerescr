document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[data-form-type]");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = form.dataset.formType;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const file = formData.get("imagen_destacada");

    try {
      // Subir imagen destacada
      const storageRef = storage.ref(`${tipo}/${Date.now()}_${file.name}`);
      await storageRef.put(file);
      const urlDestacada = await storageRef.getDownloadURL();

      // Subir galería (si hay)
      const imagenesGaleria = formData.getAll("imagenes[]");
      const urlsGaleria = [];
      for (let img of imagenesGaleria) {
        const refGaleria = storage.ref(`${tipo}/galeria/${Date.now()}_${img.name}`);
        await refGaleria.put(img);
        urlsGaleria.push(await refGaleria.getDownloadURL());
      }

      // Guardar en Firestore
      await db.collection(tipo).add({
        ...data,
        imagen_destacada: urlDestacada,
        galeria: urlsGaleria,
        estado: "pendiente",
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
      });

      alert("✅ Enviado correctamente. Tu anuncio está pendiente de revisión.");
      form.reset();
      window.location.href = "gracias.html";

    } catch (error) {
      console.error(error);
      alert("❌ Error al enviar el formulario. Intenta de nuevo.");
    }
  });
});
