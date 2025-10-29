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

const lista = document.getElementById("lista-ventas");
const buscador = document.getElementById("buscador");
const filtroProvincia = document.getElementById("filtro-provincia");
const filtroCanton = document.getElementById("filtro-canton");
const filtroDistrito = document.getElementById("filtro-distrito");

let ventas = [];

async function cargarVentas() {
  const snapshot = await db.collection("ventas").where("aprobado", "==", true).get();
  ventas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderizarFiltros();
  renderizarLista(ventas);
}

cargarVentas();

function renderizarFiltros() {
  const provincias = [...new Set(ventas.map(v => v.provincia).filter(Boolean))];
  filtroProvincia.innerHTML = `<option value="">Provincia</option>` + provincias.map(p => `<option>${p}</option>`).join("");
}

filtroProvincia.addEventListener("change", () => {
  const provinciaSeleccionada = filtroProvincia.value;
  const cantones = [...new Set(ventas.filter(v => v.provincia === provinciaSeleccionada).map(v => v.canton))];
  filtroCanton.innerHTML = `<option value="">Cantón</option>` + cantones.map(c => `<option>${c}</option>`).join("");
  filtroDistrito.innerHTML = `<option value="">Distrito</option>`;
});

filtroCanton.addEventListener("change", () => {
  const cantonSeleccionado = filtroCanton.value;
  const distritos = [...new Set(ventas.filter(v => v.canton === cantonSeleccionado).map(v => v.distrito))];
  filtroDistrito.innerHTML = `<option value="">Distrito</option>` + distritos.map(d => `<option>${d}</option>`).join("");
});

function renderizarLista(datos) {
  lista.innerHTML = datos.length
    ? datos.map(v => `
      <div class="card">
        <img src="${v.imagenesURLs?.[0] || 'img/sin-imagen.jpg'}" alt="${v.titulo}">
        <div class="info">
          <h3>${v.titulo}</h3>
          <p>${v.descripcion?.substring(0, 100)}...</p>
          <p><strong>Ubicación:</strong> ${v.distrito}, ${v.canton}, ${v.provincia}</p>
          ${v.mostrarContacto ? `<a href="mailto:${v.email}" class="btn">Contactar</a>` : ""}
        </div>
      </div>`).join("")
    : `<p>No hay propiedades en venta disponibles.</p>`;
}

[buscador, filtroProvincia, filtroCanton, filtroDistrito].forEach(el =>
  el.addEventListener("input", aplicarFiltros)
);

function aplicarFiltros() {
  const texto = buscador.value.toLowerCase();
  const provincia = filtroProvincia.value;
  const canton = filtroCanton.value;
  const distrito = filtroDistrito.value;

  const filtrados = ventas.filter(v =>
    (!provincia || v.provincia === provincia) &&
    (!canton || v.canton === canton) &&
    (!distrito || v.distrito === distrito) &&
    (v.titulo.toLowerCase().includes(texto) || v.descripcion.toLowerCase().includes(texto))
  );

  renderizarLista(filtrados);
}
