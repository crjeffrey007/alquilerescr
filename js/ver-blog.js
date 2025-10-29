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
// MOSTRAR ARTÍCULO INDIVIDUAL
// ===============================
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const tituloPost = document.getElementById("tituloPost");
const contenidoPost = document.getElementById("contenidoPost");

async function cargarPost() {
  if (!postId) {
    tituloPost.textContent = "Artículo no encontrado";
    return;
  }

  try {
    const doc = await db.collection("blog").doc(postId).get();

    if (!doc.exists) {
      tituloPost.textContent = "Artículo no encontrado";
      return;
    }

    const post = doc.data();

    tituloPost.textContent = post.titulo;
    contenidoPost.innerHTML = `
      <img src="${post.imagenURL}" alt="${post.titulo}" class="imagen-post">
      <article>
        <p class="fecha">Publicado el ${new Date(post.fecha).toLocaleDateString("es-CR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })}</p>
        <div class="texto">${post.contenido.replace(/\n/g, "<br>")}</div>
      </article>
    `;
  } catch (error) {
    console.error("Error al cargar artículo:", error);
    tituloPost.textContent = "Error al cargar el artículo";
  }
}

cargarPost();
