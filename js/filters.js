// js/filters.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

export async function cargarPublicaciones(tipo, containerId, filtros) {
  const snapshot = await getDocs(collection(db, tipo));
  const cont = document.getElementById(containerId);
  cont.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    if (
      (!filtros.provincia || d.provincia === filtros.provincia) &&
      (!filtros.tipo || d.tipoPropiedad === filtros.tipo) &&
      (!filtros.min || d.precio >= filtros.min) &&
      (!filtros.max || d.precio <= filtros.max)
    ) {
      cont.innerHTML += `
        <div class="card">
          <img src="${d.heroUrl}" alt="${d.titulo}">
          <h3>${d.titulo}</h3>
          <p>${d.provincia}, ${d.canton}</p>
          <p>${d.tipoPropiedad} - ₡${d.precio}</p>
          ${d.mapa ? `<a href="${d.mapa}" target="_blank">Ver mapa</a>` : ""}
        </div>`;
    }
  });
}
