import { db, storage } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const form = document.getElementById("ventaForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = form.titulo.value;
  const descripcion = form.descripcion.value;
  const precio = parseInt(form.precio.value);
  const provincia = form.provincia.value;
  const canton = form.canton.value;
  const distrito = form.distrito.value;
  const tipo = form.tipo.value;
  const telefono = form.telefono.value;
  const mapa = form.mapa.value;
  const imagenes = form.imagenes.files;

  const urls = [];
  for (let file of imagenes) {
    const storageRef = ref(storage, "ventas/" + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  await addDoc(collection(db, "ventas"), {
    titulo, descripcion, precio, tipo,
    provincia, canton, distrito, telefono, mapa,
    imagenes: urls, fecha: new Date()
  });

  alert("✅ Propiedad en venta publicada correctamente.");
  form.reset();
});
