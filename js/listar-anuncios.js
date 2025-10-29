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

const lista = document.getElementById("lista-anuncios");
const buscador = document.getElementById("buscador");
const filtroProvincia = document.getElementById("filtro-provincia");
const filtroCanton = document.getElementById("filtro-canton");
const filtroDistrito = document.getElementById("filtro-distrito");

let anuncios = [];

async function cargarAnuncios() {
  const snapshot = await db.collection("anuncios_comerciales").where("aprobado", "==", true).get();
  anuncios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderizarFiltros();
  renderizarLista(anuncios);
}

cargarAnuncios();

function renderizarFiltros() {
  const provincias = [...new Set(anuncios.map(a => a.provincia).filter(Boolean))];
  filtroProvincia.innerHTML = `<option value="">Provincia</option>` + provincias.map(p => `<option>${p}</option>`).join("");
}

filtroProvincia.addEventListener("change", () => {
  const provinciaSeleccionada = filtroProvincia.value;
  const cantones = [...new Set(anuncios.filter(a => a.provincia === provinciaSeleccionada).map(a => a.canton))];
  filtroCanton.innerHTML = `<option value="">Cantón</option>` + cantones.map(c => `<option>${c}</option>`).join("");
  filtroDistrito.innerHTML = `<option value="">Distrito</option>`;
});

filtroCanton.addEventListener("change", () => {
  const cantonSeleccionado = filtroCanton.value;
  const distritos = [...new Set(anuncios.filter(a => a.canton === cantonSeleccionado).map(a => a.distrito))];
  filtroDistrito.innerHTML = `<option value="">Distrito</option>` + distritos.map(d => `<option>${d}</option>`).join("");
});

function renderizarLista(datos) {
  lista.innerHTML = datos.length
    ? datos.map(a => `
      <div class="card">
        <img src="${a.logoURL || 'img/sin-imagen.jpg'}" alt="${a.titulo}">
        <div class="info">
          <h3>${a.titulo}</h3>
          <p>${a.descripcion?.substring(0, 100)}...</p>
          <p><strong>Ubicación:</strong> ${a.distrito}, ${a.canton}, ${a.provincia}</p>
          ${a.mostrarContacto ? `<a href="tel:${a.telefono}" class="btn">Contactar</a>` : ""}
        </div>
      </div>`).join("")
    : `<p>No hay anuncios comerciales disponibles.</p>`;
}

[buscador, filtroProvincia, filtroCanton, filtroDistrito].forEach(el =>
  el.addEventListener("input", aplicarFiltros)
);

function aplicarFiltros() {
  const texto = buscador.value.toLowerCase();
  const provincia = filtroProvincia.value;
  const canton = filtroCanton.value;
  const distrito = filtroDistrito.value;

  const filtrados = anuncios.filter(a =>
    (!provincia || a.provincia === provincia) &&
    (!canton || a.canton === canton) &&
    (!distrito || a.distrito === distrito) &&
    (a.titulo.toLowerCase().includes(texto) || a.descripcion.toLowerCase().includes(texto))
  );

  renderizarLista(filtrados);
}
