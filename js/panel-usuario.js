const db = firebase.firestore();
const lista = document.getElementById("listaPublicaciones");
const modal = document.getElementById("modalEdicion");
const cerrarModal = document.getElementById("cerrarModal");
const formEditar = document.getElementById("formEditar");

const filtroTipo = document.getElementById("filtroTipo");
const filtroEstado = document.getElementById("filtroEstado");
const filtroActivo = document.getElementById("filtroActivo");
const ordenFecha = document.getElementById("ordenFecha");
const busqueda = document.getElementById("busqueda");
const btnFiltrar = document.getElementById("btnFiltrar");

let publicaciones = [];
let editId = "";
let editColeccion = "";

const colecciones = [
  { nombre: "alquileres", titulo: "Alquileres" },
  { nombre: "ventas", titulo: "Ventas" },
  { nombre: "anunciosComerciales", titulo: "Anuncios Comerciales" },
];

async function cargarPublicaciones() {
  lista.innerHTML = "<p>Cargando publicaciones...</p>";
  let resultados = [];

  for (let col of colecciones) {
    if (filtroTipo.value !== "todos" && col.nombre !== filtroTipo.value) continue;
    const snap = await db.collection(col.nombre).orderBy("fechaPublicacion", ordenFecha.value).get();

    snap.forEach(doc => {
      resultados.push({
        id: doc.id,
        coleccion: col.nombre,
        ...doc.data()
      });
    });
  }

  publicaciones = resultados;
  aplicarFiltros();
}

function aplicarFiltros() {
  let filtradas = publicaciones.filter(pub => {
    if (filtroEstado.value !== "todos" && pub.estado !== filtroEstado.value) return false;
    if (filtroActivo.value !== "todos" && String(pub.activo) !== filtroActivo.value) return false;
    const texto = busqueda.value.toLowerCase();
    if (texto && !(pub.titulo?.toLowerCase().includes(texto) || pub.descripcion?.toLowerCase().includes(texto))) return false;
    return true;
  });

  mostrarPublicaciones(filtradas);
}

function mostrarPublicaciones(data) {
  if (data.length === 0) {
    lista.innerHTML = "<p>No se encontraron publicaciones con los filtros aplicados.</p>";
    return;
  }

  lista.innerHTML = data.map(pub => {
    const fecha = pub.fechaPublicacion
      ? new Date(pub.fechaPublicacion.seconds * 1000).toLocaleDateString()
      : "Sin fecha";
    const estado = pub.estado || "pendiente";
    const claseEstado = estado === "aprobado" ? "aprobado" : estado === "rechazado" ? "rechazado" : "pendiente";

    return `
      <div class="card">
        <img src="${pub.imagenDestacada || pub.imagenes?.[0] || 'img/no-image.png'}" alt="Imagen">
        <h3>${pub.titulo}</h3>
        <p><b>Tipo:</b> ${pub.coleccion}</p>
        <p><b>Fecha:</b> ${fecha}</p>
        <p><span class="estado ${claseEstado}">${estado.toUpperCase()}</span></p>
        <p>${pub.descripcion ? pub.descripcion.substring(0, 80) + "..." : "(sin descripción)"}</p>
        <p><b>Activo:</b> ${pub.activo ? "🟢" : "🔴"}</p>
        <div class="acciones">
          <button onclick="editar('${pub.id}', '${pub.coleccion}')">✏️</button>
          <button onclick="toggleActivo('${pub.id}', '${pub.coleccion}', ${!pub.activo})" class="inactive">
            ${pub.activo ? "Desactivar" : "Activar"}
          </button>
          <button onclick="eliminar('${pub.id}', '${pub.coleccion}')" class="delete">🗑</button>
        </div>
      </div>`;
  }).join("");
}

function editar(id, coleccion) {
  const pub = publicaciones.find(p => p.id === id && p.coleccion === coleccion);
  if (!pub) return;
  editId = id;
  editColeccion = coleccion;

  document.getElementById("editTitulo").value = pub.titulo;
  document.getElementById("editDescripcion").value = pub.descripcion;
  document.getElementById("editTelefono").value = pub.telefono || "";
  document.getElementById("editEmail").value = pub.email || "";
  document.getElementById("editActivo").value = pub.activo ? "true" : "false";

  modal.style.display = "flex";
}

formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("editTitulo").value;
  const descripcion = document.getElementById("editDescripcion").value;
  const telefono = document.getElementById("editTelefono").value;
  const email = document.getElementById("editEmail").value;
  const activo = document.getElementById("editActivo").value === "true";

  await db.collection(editColeccion).doc(editId).update({
    titulo, descripcion, telefono, email, activo
  });

  modal.style.display = "none";
  cargarPublicaciones();
});

async function toggleActivo(id, coleccion, estado) {
  await db.collection(coleccion).doc(id).update({ activo: estado });
  cargarPublicaciones();
}

async function eliminar(id, coleccion) {
  if (confirm("¿Seguro que querés eliminar esta publicación?")) {
    await db.collection(coleccion).doc(id).delete();
    cargarPublicaciones();
  }
}

cerrarModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

btnFiltrar.onclick = () => aplicarFiltros();
busqueda.addEventListener("input", aplicarFiltros);

cargarPublicaciones();
