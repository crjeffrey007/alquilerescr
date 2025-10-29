// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===============================
// LISTAR POSTS
// ===============================
const contenedorPosts = document.getElementById("contenedorPosts");
const buscarPost = document.getElementById("buscarPost");

let posts = [];

function mostrarPosts(filtrados = posts) {
  contenedorPosts.innerHTML = filtrados.map(post => `
    <article class="post">
      <img src="${post.imagenURL}" alt="${post.titulo}">
      <h2>${post.titulo}</h2>
      <p>${post.contenido.substring(0, 150)}...</p>
      <a href="ver-blog.html?id=${post.id}" class="btn-leer">Leer más</a>
    </article>
  `).join("");
}

db.collection("blog").orderBy("fecha", "desc").onSnapshot(snapshot => {
  posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  mostrarPosts();
});

buscarPost.addEventListener("input", e => {
  const valor = e.target.value.toLowerCase();
  const filtrados = posts.filter(p => p.titulo.toLowerCase().includes(valor));
  mostrarPosts(filtrados);
});
