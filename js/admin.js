// js/admin.js
import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const secciones = ["alquileres", "ventas", "anuncios"];

async function cargarPendientes() {
  const cont = document.getElementById("pendientes");
  cont.innerHTML = "";
  for (const s of secciones) {
    const snap = await getDocs(collection(db, s));
    snap.forEach(d => {
      const data = d.data();
      if (data.estado === "pendiente") {
        cont.innerHTML += `
          <div class="item">
            <h4>${data.titulo}</h4>
            <p>${s.toUpperCase()} - ${data.provincia}</p>
            <button onclick="aprobar('${s}','${d.id}')">Aprobar</button>
            <button onclick="eliminar('${s}','${d.id}')">Eliminar</button>
          </div>`;
      }
    });
  }
}

window.aprobar = async (col, id) => {
  await updateDoc(doc(db, col, id), { estado: "publicado" });
  alert("Publicación aprobada");
  cargarPendientes();
};

window.eliminar = async (col, id) => {
  await deleteDoc(doc(db, col, id));
  alert("Publicación eliminada");
  cargarPendientes();
};

cargarPendientes();
