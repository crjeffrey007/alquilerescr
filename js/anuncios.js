// anuncios.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const form = document.getElementById("form-anuncio");
const misAnuncios = document.getElementById("mis-anuncios");

const uid = localStorage.getItem("uid");

async function cargarAnuncios() {
  const q = query(collection(db, "anuncios"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  misAnuncios.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("anuncio-card");
    card.innerHTML = `
      <h4>${data.titulo}</h4>
      <p>${data.descripcion}</p>
      <button onclick="editarAnuncio('${docSnap.id}')">Editar</button>
      <button onclick="eliminarAnuncio('${docSnap.id}')">Eliminar</button>
    `;
    misAnuncios.appendChild(card);
  });
}

window.editarAnuncio = async (id) => {
  const titulo = prompt("Nuevo título:");
  const descripcion = prompt("Nueva descripción:");
  if (!titulo || !descripcion) return;
  const ref = doc(db, "anuncios", id);
  await updateDoc(ref, { titulo, descripcion });
  cargarAnuncios();
};

window.eliminarAnuncio = async (id) => {
  const ref = doc(db, "anuncios", id);
  await deleteDoc(ref);
  cargarAnuncios();
};

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      uid,
      titulo: form.titulo.value,
      descripcion: form.descripcion.value,
      fecha: new Date(),
    };
    await addDoc(collection(db, "anuncios"), data);
    alert("Anuncio guardado con éxito!");
    form.reset();
    cargarAnuncios();
  });
}

if (misAnuncios) cargarAnuncios();
