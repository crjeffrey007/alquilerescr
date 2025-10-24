import { auth, db } from "./firebase.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Tabs
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
tabBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  })
);

// Verifica si es admin
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  const adminsRef = collection(db, "admins");
  const snapshot = await getDocs(adminsRef);
  const emails = snapshot.docs.map((doc) => doc.data().email);

  if (!emails.includes(user.email)) {
    alert("Acceso denegado. Solo administradores.");
    await signOut(auth);
    window.location.href = "index.html";
  } else {
    cargarAnuncios();
    cargarUsuarios();
    cargarPosts();
  }
});

// --- Cargar anuncios ---
async function cargarAnuncios() {
  const ref = collection(db, "anuncios");
  const snap = await getDocs(ref);
  const lista = document.getElementById("listaAnuncios");
  lista.innerHTML = "";
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("admin-card");
    card.innerHTML = `
      <h3>${data.titulo}</h3>
      <p>${data.descripcion}</p>
      <p><b>Estado:</b> ${data.activo ? "Activo" : "Inactivo"}</p>
      <button class="btn" data-id="${docSnap.id}" data-action="toggle">
        ${data.activo ? "Desactivar" : "Activar"}
      </button>
      <button class="btn danger" data-id="${docSnap.id}" data-action="delete">
        Eliminar
      </button>
    `;
    lista.appendChild(card);
  });

  lista.addEventListener("click", async (e) => {
    if (e.target.dataset.action === "toggle") {
      const ref = doc(db, "anuncios", e.target.dataset.id);
      const activo = e.target.textContent === "Desactivar" ? false : true;
      await updateDoc(ref, { activo });
      cargarAnuncios();
    } else if (e.target.dataset.action === "delete") {
      await deleteDoc(doc(db, "anuncios", e.target.dataset.id));
      cargarAnuncios();
    }
  });
}

// --- Cargar usuarios ---
async function cargarUsuarios() {
  const ref = collection(db, "usuarios");
  const snap = await getDocs(ref);
  const lista = document.getElementById("listaUsuarios");
  lista.innerHTML = "";
  snap.forEach((docSnap) => {
    const u = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `<h3>${u.nombre}</h3><p>${u.email}</p>`;
    lista.appendChild(div);
  });
}

// --- Cargar blog ---
async function cargarPosts() {
  const ref = collection(db, "posts");
  const snap = await getDocs(ref);
  const lista = document.getElementById("listaPosts");
  lista.innerHTML = "";
  snap.forEach((docSnap) => {
    const p = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("admin-card");
    div.innerHTML = `
      <h3>${p.titulo}</h3>
      <p>${p.categoria}</p>
      <button class="btn danger" data-id="${docSnap.id}" data-action="delete-post">Eliminar</button>
    `;
    lista.appendChild(div);
  });

  lista.addEventListener("click", async (e) => {
    if (e.target.dataset.action === "delete-post") {
      await deleteDoc(doc(db, "posts", e.target.dataset.id));
      cargarPosts();
    }
  });
}
