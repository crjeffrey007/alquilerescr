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
// REFERENCIAS DOM
// ===============================
const lista = document.getElementById("lista-ventas");
const filtroProvincia = document.getElementById("filtro-provincia");
const filtroCanton = document.getElementById("filtro-canton");
const filtroDistrito = document.getElementById("filtro-distrito");
const buscador = document.getElementById("buscador");

let todos = [];

// ===============================
// CARGAR DATOS
// ===============================
async function cargarVentas() {
  const snap = await db.collection("ventas").where("aprobado", "==", true).get();
  todos = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  generarFiltros();
  mostrarVentas(todos);
}

function generarFiltros() {
  const provincias = [...new Set(todos.map(a => a.provincia).filter(Boolean))];
  filtroProvincia.innerHTML = `<option value="">Todas</option>` +
    provincias.map(p => `<option value="${p}">${p}</option>`).join("");
}

function mostrarVentas(datos) {
  lista.innerHTML = "";
  if (datos.length === 0) {
    lista.innerHTML = "<p>No hay propiedades en venta disponibles.</p>";
    return;
  }

  datos.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    const img = p.imagenesURLs?.[0] || "img/sin-foto.jpg";
    const precio = p.precio ? `<strong>₡ ${p.precio.toLocaleString()}</strong>` : "";

    div.innerHTML = `
      <img src="${img}" alt="${p.titulo}">
      <div class="info">
        <h3><a href="detalle.html?tipo=ventas&id=${p.id}">${p.titulo}</a></h3>
        <p>${p.descripcion?.substring(0, 120)}...</p>
        <p>${precio}</p>
        <p><strong>${p.provincia || ""}, ${p.canton || ""}</strong></p>
      </div>
    `;
    lista.appendChild(div);
  });
}

// ===============================
// FILTROS Y BÚSQUEDA
// ===============================
function aplicarFiltros() {
  const prov = filtroProvincia.value.toLowerCase();
  const cant = filtroCanton.value.toLowerCase();
  const dist = filtroDistrito.value.toLowerCase();
  const term = buscador.value.toLowerCase();

  const filtrados = todos.filter(a =>
    (!prov || a.provincia?.toLowerCase() === prov) &&
    (!cant || a.canton?.toLowerCase() === cant) &&
    (!dist || a.distrito?.toLowerCase() === dist) &&
    (!term || a.titulo?.toLowerCase().includes(term) || a.descripcion?.toLowerCase().includes(term))
  );

  mostrarVentas(filtrados);
}

[filtroProvincia, filtroCanton, filtroDistrito, buscador].forEach(el =>
  el.addEventListener("input", aplicarFiltros)
);

cargarVentas();
