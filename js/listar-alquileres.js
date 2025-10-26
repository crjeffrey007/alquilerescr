// ===============================
// CONFIGURAR FIREBASE
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// ELEMENTOS DEL DOM
// ===============================
const listado = document.getElementById("listado");
const busqueda = document.getElementById("busqueda");
const provinciaFiltro = document.getElementById("provinciaFiltro");
const cantonFiltro = document.getElementById("cantonFiltro");
const distritoFiltro = document.getElementById("distritoFiltro");

let propiedades = [];

// ===============================
// CARGAR LISTADO DE ALQUILERES
// ===============================
async function cargarPropiedades() {
  const snapshot = await db.collection("alquileres").where("aprobado", "==", true).get();
  propiedades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  actualizarFiltros();
  renderizar(propiedades);
}

// ===============================
// RENDERIZAR LISTADO
// ===============================
function renderizar(data) {
  listado.innerHTML = "";
  if (data.length === 0) {
    listado.innerHTML = "<p>No hay propiedades disponibles.</p>";
    return;
  }

  data.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${p.imagenesURLs?.[0] || "https://via.placeholder.com/400x220"}" alt="Imagen">
      <div class="card-body">
        <h3>${p.titulo}</h3>
        <p>${p.descripcion.substring(0, 120)}...</p>
        <p><strong>Provincia:</strong> ${p.provincia || "-"}</p>
        <p class="precio">${p.precio || ""} ${p.moneda || ""}</p>
        ${p.mostrarContacto ? `<button class="btn-contacto" onclick="mostrarContacto('${p.email}','${p.telefono}')">Contactar</button>` : ""}
      </div>`;
    listado.appendChild(div);
  });
}

function mostrarContacto(email, telefono) {
  alert(`📧 Email: ${email || "No disponible"}\n📞 Teléfono: ${telefono || "No disponible"}`);
}

// ===============================
// FILTROS DINÁMICOS
// ===============================
function actualizarFiltros() {
  const provincias = [...new Set(propiedades.map(p => p.provincia).filter(Boolean))];
  provinciaFiltro.innerHTML = `<option value="">Provincia</option>` + provincias.map(p => `<option>${p}</option>`).join("");

  provinciaFiltro.addEventListener("change", filtrar);
  cantonFiltro.addEventListener("change", filtrar);
  distritoFiltro.addEventListener("change", filtrar);
  busqueda.addEventListener("input", filtrar);
}

function filtrar() {
  let resultado = propiedades;

  if (busqueda.value)
    resultado = resultado.filter(p => p.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) || p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()));

  if (provinciaFiltro.value)
    resultado = resultado.filter(p => p.provincia === provinciaFiltro.value);

  renderizar(resultado);
}

// ===============================
cargarPropiedades();
