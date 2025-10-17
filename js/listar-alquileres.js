document.addEventListener("DOMContentLoaded", async () => {
  const db = firebase.firestore();
  const contenedor = document.getElementById("lista-alquileres");

  try {
    const snapshot = await db.collection("alquileres")
      .where("estado", "==", "aprobada")
      .orderBy("fechaPublicacion", "desc")
      .get();

    if (snapshot.empty) {
      contenedor.innerHTML = "<p>No hay propiedades disponibles en alquiler.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const imagen = data.imagenDestacada || "img/sin-imagen.jpg";
      const card = `
        <div class="card">
          <img src="${imagen}" alt="${data.titulo}">
          <div class="card-body">
            <h3>${data.titulo}</h3>
            <p>${data.descripcion.substring(0, 120)}...</p>
            <p><strong>Ubicación:</strong> ${data.provincia}, ${data.canton}</p>
            <p><strong>Precio:</strong> ${data.moneda} ${data.precio || "Consultar"}</p>
          </div>
        </div>
      `;
      contenedor.innerHTML += card;
    });
  } catch (e) {
    console.error("Error al cargar los alquileres:", e);
    contenedor.innerHTML = "<p>Error al cargar los datos.</p>";
  }
});
