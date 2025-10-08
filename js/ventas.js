import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const contenedor = document.getElementById("ventas-container");

async function cargarVentas() {
  const querySnapshot = await getDocs(collection(db, "ventas"));
  contenedor.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.classList.add("property-card");
    card.innerHTML = `
      <img src="${data.imagenes?.[0] || 'images/default.jpg'}" alt="${data.titulo}">
      <div class="property-info">
        <h3>${data.titulo}</h3>
        <p>${data.descripcion.substring(0, 100)}...</p>
        <p><strong>₡${data.precio.toLocaleString()}</strong></p>
        <p>${data.provincia}, ${data.canton}</p>
        <a href="${data.mapa}" target="_blank">📍 Ver en mapa</a>
        <a href="tel:${data.telefono}" class="btn">Contactar</a>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

cargarVentas();
