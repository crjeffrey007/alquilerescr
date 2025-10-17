firebase.auth().onAuthStateChanged(async (user) => {
  const userInfo = document.getElementById("user-info");
  const publicacionesDiv = document.getElementById("mis-publicaciones");

  if (!user) {
    userInfo.textContent = "No has iniciado sesión.";
    publicacionesDiv.innerHTML = "<p>Por favor inicia sesión para ver tus publicaciones.</p>";
    return;
  }

  userInfo.innerHTML = `<strong>Email:</strong> ${user.email}`;

  const db = firebase.firestore();

  const colecciones = [
    { nombre: "alquileres", titulo: "Alquileres" },
    { nombre: "ventas", titulo: "Ventas" },
    { nombre: "anunciosComerciales", titulo: "Anuncios Comerciales" },
  ];

  publicacionesDiv.innerHTML = "";

  for (let c of colecciones) {
    const snap = await db.collection(c.nombre)
      .where("uid", "==", user.uid)
      .orderBy("fechaPublicacion", "desc")
      .get();

    if (snap.empty) continue;

    const seccion = document.createElement("section");
    seccion.innerHTML = `<h3>${c.titulo}</h3>`;

    snap.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("card");

      const estadoColor =
        data.estado === "aprobado" ? "green" :
        data.estado === "rechazado" ? "red" : "orange";

      div.innerHTML = `
        <h4>${data.titulo}</h4>
        <p>${data.descripcion || "(Sin descripción)"}</p>
        <p><strong>Estado:</strong> <span style="color:${estadoColor}">${data.estado}</span></p>
        ${data.imagenes && data.imagenes.length > 0 ? `
          <img src="${data.imagenes[0]}" class="miniatura">
        ` : ""}
        <div class="acciones">
          ${data.estado !== "aprobado" ? `
            <button class="editar" data-id="${doc.id}" data-coleccion="${c.nombre}">Editar</button>
            <button class="eliminar" data-id="${doc.id}" data-coleccion="${c.nombre}">Eliminar</button>
          ` : ""}
        </div>
      `;
      seccion.appendChild(div);
    });

    publicacionesDiv.appendChild(seccion);
  }

  document.querySelectorAll(".eliminar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const col = btn.getAttribute("data-coleccion");
      if (confirm("¿Deseas eliminar este anuncio?")) {
        await db.collection(col).doc(id).delete();
        alert("Anuncio eliminado correctamente.");
        location.reload();
      }
    });
  });

  document.querySelectorAll(".editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Función de edición disponible próximamente.");
    });
  });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    location.href = "index.html";
  });
});
