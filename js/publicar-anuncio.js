import { db, storage } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const form = document.getElementById("formAnuncio");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    titulo: form.titulo.value,
    tipo: form.tipo.value,
    descripcion: form.descripcion.value,
    provincia: form.provincia.value,
    canton: form.canton.value,
    distrito: form.distrito.value,
    mapa: form.mapa.value,
    precio: form.precio.value,
    area: form.area.value,
    habitaciones: form.habitaciones.value,
    banos: form.banos.value,
    parqueo: form.parqueo.value,
    amueblado: form.amueblado.value,
    mascotas: form.mascotas.value,
    telefono: form.telefono.value,
    email: form.email.value,
    redes: form.redes.value,
    fecha: new Date(),
  };

  const imagenes = form.imagenes.files;
  const urls = [];

  for (const img of imagenes) {
    const refImg = ref(storage, `anuncios/${img.name}`);
    await uploadBytes(refImg, img);
    const url = await getDownloadURL(refImg);
    urls.push(url);
  }

  data.imagenes = urls;

  await addDoc(collection(db, "anuncios"), data);
  alert("✅ Anuncio publicado con éxito");
  form.reset();
});
