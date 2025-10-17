document.addEventListener("DOMContentLoaded", async () => {
  const db = firebase.firestore();
  const contenedor = document.getElementById("lista-anuncios");

  try {
    const snapshot = await db.collection("anuncios")
      .where("estado", "==", "aprobada")
      .orderBy("fechaPublicacion", "desc")
      .get();

    if (snapshot.empty) {
      contenedor.innerHTML = "<p>No hay anuncios comerciales disponibles.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const logo = data.logo || "img/sin-logo.jpg";
      const card = `
        <div class="card">
          <img src="${logo}" alt="${data.titulo}">
          <div class="card-body">
            <h3>${data.titulo}</h3>
            <p>${data.descripcion.substring(0, 100)}...</p>
            <p><strong>Negocio:</strong> ${data.nombre_negocio}</p>
            <p><strong>Teléfono:</strong> ${data.telefono}</p>
            <p><strong>Servicio a domicilio:</strong> ${data.servicio_domicilio ? "Sí" : "No"}</p>
          </div>
        </div>
      `;
      contenedor.innerHTML += card;
    });
  } catch (e) {
    console.error("Error al cargar los anuncios:", e);
    contenedor.innerHTML = "<p>Error al cargar los datos.</p>";
  }
});
