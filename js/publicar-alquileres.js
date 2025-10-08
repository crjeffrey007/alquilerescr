import { db, storage } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const form = document.getElementById("alquilerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = form.titulo.value;
  const descripcion = form.descripcion.value;
  const precio = parseInt(form.precio.value);
  const provincia = form.provincia.value;
  const canton = form.canton.value;
  const distrito = form.distrito.value;
  const telefono = form.telefono.value;
  const mapa = form.mapa.value;
  const imagenes = form.imagenes.files;

  // Subir imágenes al Storage
  const urls = [];
  for (let file of imagenes) {
    const storageRef = ref(storage, "alquileres/" + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  // Guardar en Firestore
  await addDoc(collection(db, "alquileres"), {
    titulo, descripcion, precio, provincia, canton, distrito,
    telefono, mapa, imagenes: urls, fecha: new Date()
  });

  alert("✅ Propiedad publicada correctamente.");
  form.reset();
});
