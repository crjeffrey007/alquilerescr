const lista = document.getElementById("listaPublicaciones");
const modal = document.getElementById("modalEdicion");
const cerrarModal = document.getElementById("cerrarModal");
const formEditar = document.getElementById("formEditar");

let editId = "";
let publicaciones = [];

// 🔥 Cargar publicaciones del usuario
async function cargarPublicaciones() {
  lista.innerHTML = "<p>Cargando publicaciones...</p>";

  const snapshot = await db.collection("anuncios").get();
  publicaciones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (publicaciones.length === 0) {
    lista.innerHTML = "<p>No tenés publicaciones aún.</p>";
    return;
  }

  lista.innerHTML = publicaciones.map(pub => `
    <div class="card">
      <img src="${pub.logo || (pub.imagenes?.[0] || 'img/no-image.png')}" alt="imagen">
      <h3>${pub.titulo}</h3>
      <p>${pub.descripcion.substring(0, 80)}...</p>
      <p><b>Estado:</b> ${pub.activo ? "🟢 Activo" : "🔴 Inactivo"}</p>
      <div class="acciones">
        <button onclick="editar('${pub.id}')">✏️ Editar</button>
        <button onclick="toggleActivo('${pub.id}', ${!pub.activo})">${pub.activo ? "Desactivar" : "Activar"}</button>
        <button onclick="eliminar('${pub.id}')">🗑 Eliminar</button>
      </div>
    </div>
  `).join("");
}

// ✏️ Editar
function editar(id) {
  const pub = publicaciones.find(p => p.id === id);
  if (!pub) return;

  editId = id;
  document.getElementById("editTitulo").value = pub.titulo;
  document.getElementById("editDescripcion").value = pub.descripcion;
  document.getElementById("editTelefono").value = pub.telefono;
  document.getElementById("editEmail").value = pub.email || "";
  document.getElementById("editActivo").value = pub.activo ? "true" : "false";

  modal.style.display = "flex";
}

// 💾 Guardar edición
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("editTitulo").value;
  const descripcion = document.getElementById("editDescripcion").value;
  const telefono = document.getElementById("editTelefono").value;
  const email = document.getElementById("editEmail").value;
  const activo = document.getElementById("editActivo").value === "true";

  await db.collection("anuncios").doc(editId).update({
    titulo, descripcion, telefono, email, activo
  });

  modal.style.display = "none";
  cargarPublicaciones();
});

// 🔄 Activar/Desactivar
async function toggleActivo(id, estado) {
  await db.collection("anuncios").doc(id).update({ activo: estado });
  cargarPublicaciones();
}

// 🗑 Eliminar
async function eliminar(id) {
  if (confirm("¿Seguro que querés eliminar este anuncio?")) {
    await db.collection("anuncios").doc(id).delete();
    cargarPublicaciones();
  }
}

// 🔒 Cerrar modal
cerrarModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

cargarPublicaciones();
