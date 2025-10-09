// js/forms.js
import { db, storage } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

async function subirArchivo(input) {
  const file = input.files[0];
  const storageRef = ref(storage, `imagenes/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

document.querySelectorAll(".form-publicacion").forEach(form => {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const tipo = form.dataset.tipo;
    const heroUrl = await subirArchivo(form.querySelector(".hero"));
    await addDoc(collection(db, tipo), {
      titulo: form.titulo.value,
      provincia: form.provincia.value,
      canton: form.canton.value,
      precio: parseFloat(form.precio.value),
      tipoPropiedad: form.tipoPropiedad.value,
      mapa: form.mapa.value,
      descripcion: form.descripcion.value,
      heroUrl,
      estado: "pendiente",
      creado: serverTimestamp()
    });
    alert("Tu publicación ha sido enviada para revisión.");
    form.reset();
  });
});
