// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const contenedor = document.getElementById("contenedorAlquileres");
const filtroProvincia = document.getElementById("filtroProvincia");

async function cargarAlquileres(provincia = "") {
  contenedor.innerHTML = "<p>Cargando propiedades...</p>";
  let ref = db.collection("propiedades_alquiler");
  if (provincia) ref = ref.where("provincia", "==", provincia);

  const snapshot = await ref.get();
  contenedor.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${data.imagenesURLs?.[0] || 'https://via.placeholder.com/300'}" alt="${data.titulo}">
      <h3>${data.titulo}</h3>
      <p>${data.provincia || ''} - ${data.canton || ''}</p>
      <p><strong>${data.moneda === "USD" ? "$" : "₡"}${data.precio || ''}</strong></p>
      <a href="ver-alquiler.html?id=${doc.id}" class="btn">Ver detalles</a>
    `;
    contenedor.appendChild(card);
  });
}

filtroProvincia.addEventListener("change", () => {
  cargarAlquileres(filtroProvincia.value);
});

cargarAlquileres();
