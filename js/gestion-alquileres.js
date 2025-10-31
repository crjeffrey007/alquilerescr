import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contentArea = document.getElementById("contentArea");

async function cargarAlquileres() {
  contentArea.innerHTML = `
    <h2>🏠 Gestión de Alquileres</h2>
    <input id="buscarAlquiler" placeholder="Buscar..." class="buscador">
    <table class="tabla-admin">
      <thead>
        <tr>
          <th>Título</th>
          <th>Precio</th>
          <th>Provincia</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="alquileresBody"></tbody>
    </table>
  `;

  const snapshot = await getDocs(collection(db, "alquileres"));
  const tbody = document.getElementById("alquileresBody");

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.titulo || ""}</td>
      <td>${data.precio || ""}</td>
      <td>${data.provincia || ""}</td>
      <td>${data.activo ? "Activo" : "Pendiente"}</td>
      <td>
        <button class="btn-aprobar" data-id="${docSnap.id}">✅</button>
        <button class="btn-editar" data-id="${docSnap.id}">✏️</button>
        <button class="btn-eliminar" data-id="${docSnap.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Aprobar
  document.querySelectorAll(".btn-aprobar").forEach(btn => {
    btn.addEventListener("click", async () => {
      await updateDoc(doc(db, "alquileres", btn.dataset.id), { activo: true });
      Swal.fire("Aprobado", "El anuncio fue activado", "success");
      cargarAlquileres();
    });
  });

  // Eliminar
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "alquileres", btn.dataset.id));
      Swal.fire("Eliminado", "Anuncio eliminado correctamente", "info");
      cargarAlquileres();
    });
  });
}

cargarAlquileres();
