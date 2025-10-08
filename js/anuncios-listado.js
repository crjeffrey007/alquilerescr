import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const lista = document.getElementById("lista-anuncios");

async function cargarAnuncios() {
  const q = query(collection(db, "anuncios"), orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);
  lista.innerHTML = "";

  snapshot.forEach((doc) => {
    const a = doc.data();
    const card = `
      <div class="card">
        <img src="${a.imageUrl || 'https://via.placeholder.com/400x250'}" alt="">
        <h3>${a.titulo}</h3>
        <p>${a.descripcion}</p>
        <p><strong>₡${a.precio || 'Consultar'}</strong></p>
        <p>${a.ubicacion}</p>
      </div>
    `;
    lista.innerHTML += card;
  });
}

cargarAnuncios();
