document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("pendientes");
  const colecciones = ["alquiler", "venta", "negocio"];

  for (let col of colecciones) {
    const snap = await db.collection(col).where("estado", "==", "pendiente").get();
    snap.forEach((doc) => {
      const d = doc.data();
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <img src="${d.imagen_destacada}" width="200">
        <h3>${d.titulo || d.nombre_negocio}</h3>
        <button onclick="aprobar('${col}', '${doc.id}')">Aprobar</button>
        <button onclick="rechazar('${col}', '${doc.id}')">Rechazar</button>
      `;
      contenedor.appendChild(div);
    });
  }
});

async function aprobar(col, id) {
  await db.collection(col).doc(id).update({ estado: "aprobado" });
  alert("✅ Publicación aprobada.");
  location.reload();
}

async function rechazar(col, id) {
  await db.collection(col).doc(id).delete();
  alert("❌ Publicación eliminada.");
  location.reload();
}
