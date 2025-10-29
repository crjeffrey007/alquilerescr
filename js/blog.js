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
// ELEMENTOS
// ===============================
const listaBlog = document.getElementById("listaBlog");
const buscarTitulo = document.getElementById("buscarTitulo");
const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");
const btnFiltrar = document.getElementById("btnFiltrar");
const btnLimpiar = document.getElementById("btnLimpiar");

const paginacion = document.createElement("div");
paginacion.classList.add("paginacion");
listaBlog.after(paginacion);

let posts = [];
let paginaActual = 1;
const porPagina = 12;

// ===============================
// CARGAR BLOGS
// ===============================
function cargarBlog() {
  db.collection("blog").orderBy("fecha", "desc").onSnapshot(snapshot => {
    posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    paginaActual = 1;
    mostrarPosts(posts);
  });
}

// ===============================
// MOSTRAR POSTS + PAGINACIÓN
// ===============================
function mostrarPosts(lista) {
  listaBlog.innerHTML = "";
  paginacion.innerHTML = "";

  if (lista.length === 0) {
    listaBlog.innerHTML = `<p class="sin-resultados">No se encontraron artículos.</p>`;
    return;
  }

  // Calcular páginas
  const totalPaginas = Math.ceil(lista.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const visibles = lista.slice(inicio, fin);

  // Renderizar artículos
  visibles.forEach(post => {
    const card = document.createElement("article");
    card.classList.add("card");

    const fecha = new Date(post.fecha).toLocaleDateString("es-CR");
    const img = post.imagenURL
      ? `<img src="${post.imagenURL}" alt="${post.titulo}" class="img-card">`
      : "";

    card.innerHTML = `
      ${img}
      <div class="card-body">
        <h3>${post.titulo}</h3>
        <p class="fecha">${fecha}</p>
        <p>${post.contenido.substring(0, 120)}...</p>
        <a href="ver-blog.html?id=${post.id}" class="btn">Leer más</a>
      </div>
    `;
    listaBlog.appendChild(card);
  });

  // Renderizar paginación
  if (totalPaginas > 1) {
    if (paginaActual > 1) {
      const prev = document.createElement("button");
      prev.textContent = "← Anteriores";
      prev.classList.add("btn");
      prev.addEventListener("click", () => {
        paginaActual--;
        mostrarPosts(lista);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      paginacion.appendChild(prev);
    }

    const info = document.createElement("span");
    info.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    info.classList.add("info-pagina");
    paginacion.appendChild(info);

    if (paginaActual < totalPaginas) {
      const next = document.createElement("button");
      next.textContent = "Siguientes →";
      next.classList.add("btn");
      next.addEventListener("click", () => {
        paginaActual++;
        mostrarPosts(lista);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      paginacion.appendChild(next);
    }
  }
}

// ===============================
// FILTROS
// ===============================
btnFiltrar.addEventListener("click", () => {
  const texto = buscarTitulo.value.toLowerCase();
  const desde = fechaInicio.value ? new Date(fechaInicio.value) : null;
  const hasta = fechaFin.value ? new Date(fechaFin.value) : null;

  const filtrados = posts.filter(p => {
    const tituloMatch = p.titulo.toLowerCase().includes(texto);
    const fecha = new Date(p.fecha);
    const fechaMatch = (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    return tituloMatch && fechaMatch;
  });

  paginaActual = 1;
  mostrarPosts(filtrados);
});

btnLimpiar.addEventListener("click", () => {
  buscarTitulo.value = "";
  fechaInicio.value = "";
  fechaFin.value = "";
  paginaActual = 1;
  mostrarPosts(posts);
});

cargarBlog();
