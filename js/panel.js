document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    const contenedor = document.getElementById("mis-publicaciones");
    if (!user) {
      contenedor.innerHTML = "<p>Por favor, inicia sesión para ver tus publicaciones.</p>";
      return;
    }

    const colecciones = ["alquileres", "ventas", "anuncios"];
    contenedor.innerHTML = "<p>Cargando tus publicaciones...</p>";

    let html = "";
    for (const col of colecciones) {
      const snap = await db.collection(col)
        .where("uid", "==", user.uid)
        .orderBy("fechaPublicacion", "desc")
        .get();

      snap.forEach((doc) => {
        const data = doc.data();
        const img = data.imagenDestacada || data.logo || "img/sin-imagen.jpg";
        html += `
          <div class="card">
            <img src="${img}" alt="${data.titulo}">
            <div class="card-body">
              <h3>${data.titulo}</h3>
              <p>${data.descripcion?.substring(0, 100)}...</p>
              <span class="estado ${data.estado}">${data.estado}</span>
            </div>
          </div>
        `;
      });
    }

    contenedor.innerHTML = html || "<p>No has publicado nada aún.</p>";
  });
});
