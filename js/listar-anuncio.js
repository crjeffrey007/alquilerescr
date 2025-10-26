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
const lista = document.getElementById("lista-anuncios");
const filtroProvincia = document.getElementById("filtro-provincia");
const filtroCanton = document.getElementById("filtro-canton");
const filtroDistrito = document.getElementById("filtro-distrito");
const buscador = document.getElementById("buscador");

let todos = [];

// ===============================
// CARGAR DATOS
// ===============================
async function cargarAnuncios() {
  const snap = await db.collection("anuncios_comerciales").where("aprobado", "==", true).get();
  todos = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  generarFiltros();
  mostrarAnuncios(todos);
}

function generarFiltros() {
  const provincias = [...new Set(todos.map(a => a.provincia).filter(Boolean))];
  filtroProvincia.innerHTML = `<option value="">Todas</option>` +
    provincias.map(p => `<option value="${p}">${p}</option>`).join("");
}

function mostrarAnuncios(datos) {
  lista.innerHTML = "";
  if (datos.length === 0) {
    lista.innerHTML = "<p>No hay anuncios comerciales disponibles.</p>";
    return;
  }

  datos.forEach(a => {
    const div = document.createElement("div");
    div.className = "card";

    const logo = a.logoURL || "img/sin-logo.png";
    const img = a.imagenesURLs?.[0] || "img/sin-foto.jpg";

    div.innerHTML = `
      <div class="anuncio">
        <img src="${logo}" alt="${a.nombreNegocio}" class="logo">
        <div class="info">
          <h3><a href="detalle.html?tipo=anuncios_comerciales&id=${a.id}">${a.titulo}</a></h3>
          <p>${a.descripcion?.substring(0, 120)}...</p>
          <p><strong>${a.provincia || ""}, ${a.canton || ""}</strong></p>
        </div>
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

  mostrarAnuncios(filtrados);
}

[filtroProvincia, filtroCanton, filtroDistrito, buscador].forEach(el =>
  el.addEventListener("input", aplicarFiltros)
);

cargarAnuncios();
