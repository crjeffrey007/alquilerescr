// ===============================
// FIREBASE CONFIG
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
// CARGAR BLOG
// ===============================
const contenedor = document.getElementById("contenedorBlog");
const filtro = document.getElementById("filtroCategoria");
const buscar = document.getElementById("buscarBlog");

async function cargarPublicaciones() {
  contenedor.innerHTML = "<p>Cargando publicaciones...</p>";
  const snapshot = await db.collection("blog").where("activo", "==", true).get();

  let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  mostrarPublicaciones(posts);

  // Filtros
  filtro.addEventListener("change", () => filtrar(posts));
  buscar.addEventListener("input", () => filtrar(posts));
}

function filtrar(posts) {
  const categoria = filtro.value;
  const texto = buscar.value.toLowerCase();

  let filtrados = posts.filter(p => 
    (categoria === "todas" || p.categoria === categoria) &&
    (p.titulo.toLowerCase().includes(texto) || p.contenido.toLowerCase().includes(texto))
  );

  mostrarPublicaciones(filtrados);
}

function mostrarPublicaciones(posts) {
  if (posts.length === 0) {
    contenedor.innerHTML = "<p>No hay publicaciones disponibles.</p>";
    return;
  }

  contenedor.innerHTML = posts.map(p => `
    <article class="post">
      ${p.imagen ? `<img src="${p.imagen}" alt="${p.titulo}" class="img-blog">` : ""}
      <h2>${p.titulo}</h2>
      <p class="categoria">${formatearCategoria(p.categoria)}</p>
      <p>${p.contenido.substring(0, 200)}...</p>
      <a href="#" class="leer-mas" data-id="${p.id}">Leer más</a>
    </article>
  `).join("");
}

function formatearCategoria(cat) {
  const map = {
    "recomendaciones": "Recomendaciones",
    "experiencias": "Experiencias",
    "asuntos-legales": "Asuntos legales"
  };
  return map[cat] || cat;
}

cargarPublicaciones();
