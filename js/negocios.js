import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const contenedor = document.getElementById("negocios-container");

async function cargarNegocios() {
  const querySnapshot = await getDocs(collection(db, "negocios"));
  contenedor.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.classList.add("property-card");
    card.innerHTML = `
      <img src="${data.imagen || 'images/default.jpg'}" alt="${data.nombre}">
      <div class="property-info">
        <h3>${data.nombre}</h3>
        <p>${data.descripcion.substring(0, 100)}...</p>
        <p><strong>Categoría:</strong> ${data.categoria}</p>
        <a href="${data.enlace}" target="_blank">🌐 Visitar sitio</a>
        <a href="https://wa.me/${data.telefono}" class="btn">Contactar</a>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

cargarNegocios();
