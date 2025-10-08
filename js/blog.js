import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const postsDiv = document.getElementById("posts");

async function cargarBlog() {
  const q = query(collection(db, "blog"), orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);
  postsDiv.innerHTML = "";

  snapshot.forEach((doc) => {
    const p = doc.data();
    postsDiv.innerHTML += `
      <article class="post">
        <h3>${p.titulo}</h3>
        <p>${p.contenido}</p>
      </article>
    `;
  });
}

cargarBlog();
