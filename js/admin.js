// 🔒 Verificar si el usuario está autenticado y es el administrador
firebase.auth().onAuthStateChanged(user => {
  if (!user || user.email !== "crjeffrey7@gmail.com") {
    alert("Acceso restringido. Solo el administrador puede entrar.");
    window.location.href = "index.html";
  } else {
    // Si es el admin, recién se carga el contenido del panel
    cargarPublicaciones();
  }
});

const db = firebase.firestore();
const adminDiv = document.getElementById("admin-publicaciones");

const colecciones = [
  { nombre: "alquileres", titulo: "Alquileres" },
  { nombre: "ventas", titulo: "Ventas" },
  { nombre: "anunciosComerciales", titulo: "Anuncios Comerciales" },
];

async function cargarPublicaciones(tipo = "todos", estado = "todos") {
  adminDiv.innerHTML = "<p>Cargando publicaciones...</p>";

  let resultados = [];

  for (let col of colecciones) {
    if (tipo !== "todos" && col.nombre !== tipo) continue;

    let ref = db.collection(col.nombre);

    if (estado !== "todos") {
      ref = ref.where("estado", "==", estado);
    }

    const snap = await ref.orderBy("fechaPublicacion", "desc").get();

    snap.forEach((doc) => {
      resultados.push({
        id: doc.id,
        coleccion: col.nombre,
        data: doc.data(),
      });
    });
  }

  mostrarPublicaciones(resultados);
}

function mostrarPublicaciones(publicaciones) {
  adminDiv.innerHTML = "";

  if (publicaciones.length === 0) {
    adminDiv.innerHTML = "<p>No hay publicaciones para mostrar.</p>";
    return;
  }

  publicaciones.forEach((pub) => {
    const { id, coleccion, data } = pub;
    const div = document.createElement("div");
    div.classList.add("card");

    const estadoColor =
      data.estado === "aprobado"
        ? "green"
        : data.estado === "rechazado"
        ? "red"
        : "orange";

    div.innerHTML = `
      <h3>${data.titulo}</h3>
      <p><strong>Tipo:</strong> ${coleccion}</p>
      <p><strong>Usuario:</strong> ${data.email || "No especificado"}</p>
      <p><strong>Descripción:</strong> ${data.descripcion || "(sin descripción)"}</p>
      <p><strong>Estado:</strong> <span style="color:${estadoColor}">${data.estado}</span></p>
      ${data.imagenes && data.imagenes.length > 0 ? `
        <img src="${data.imagenes[0]}" class="miniatura">
      ` : ""}
      <div class="acciones">
        <button class="aprobar" data-col="${coleccion}" data-id="${id}">Aprobar</button>
        <button class="rechazar" data-col="${coleccion}" data-id="${id}">Rechazar</button>
      </div>
    `;

    adminDiv.appendChild(div);
  });

  document.querySelectorAll(".aprobar").forEach((btn) =>
    btn.addEventListener("click", () => actualizarEstado(btn, "aprobado"))
  );

  document.querySelectorAll(".rechazar").forEach((btn) =>
    btn.addEventListener("click", () => actualizarEstado(btn, "rechazado"))
  );
}

async function actualizarEstado(btn, nuevoEstado) {
  const id = btn.getAttribute("data-id");
  const col = btn.getAttribute("data-col");

  await db.collection(col).doc(id).update({
    estado: nuevoEstado,
  });

  alert(`Publicación marcada como ${nuevoEstado.toUpperCase()}`);
  cargarPublicaciones();
}

document.getElementById("btnFiltrar").addEventListener("click", () => {
  const tipo = document.getElementById("filtroTipo").value;
  const estado = document.getElementById("filtroEstado").value;
  cargarPublicaciones(tipo, estado);
});
