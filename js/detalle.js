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
// OBTENER PARÁMETRO DE URL
// ===============================
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo"); // "alquileres" | "ventas" | "anuncios_comerciales"
const id = params.get("id");

// ===============================
// REFERENCIAS DOM
// ===============================
const tituloHeader = document.getElementById("titulo");
const contImagenes = document.getElementById("imagenes");
const contInfo = document.getElementById("info");

// ===============================
// CARGAR ANUNCIO
// ===============================
async function cargarDetalle() {
  if (!tipo || !id) {
    contInfo.innerHTML = "<p>⚠️ Anuncio no encontrado.</p>";
    return;
  }

  const doc = await db.collection(tipo).doc(id).get();
  if (!doc.exists) {
    contInfo.innerHTML = "<p>⚠️ Este anuncio no existe o fue eliminado.</p>";
    return;
  }

  const data = doc.data();
  if (!data.aprobado) {
    contInfo.innerHTML = "<p>⛔ Este anuncio aún no está aprobado por el administrador.</p>";
    return;
  }

  mostrarDetalle(data);
}

function mostrarDetalle(p) {
  tituloHeader.textContent = p.titulo;

  // IMÁGENES
  contImagenes.innerHTML = "";
  if (p.imagenesURLs && p.imagenesURLs.length > 0) {
    p.imagenesURLs.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      contImagenes.appendChild(img);
    });
  } else {
    contImagenes.innerHTML = "<p>Sin imágenes disponibles.</p>";
  }

  // INFORMACIÓN
  contInfo.innerHTML = `
    <h2>${p.titulo}</h2>
    <p><strong>Descripción:</strong> ${p.descripcion}</p>
    <p><strong>Provincia:</strong> ${p.provincia || "-"}</p>
    <p><strong>Cantón:</strong> ${p.canton || "-"}</p>
    <p><strong>Distrito:</strong> ${p.distrito || "-"}</p>
    <p class="precio">${p.precio ? `${p.precio} ${p.moneda || ""}` : ""}</p>
    ${p.mostrarContacto ? `
      <button class="btn-contacto" onclick="mostrarContacto('${p.email}', '${p.telefono}')">Ver contacto</button>
    ` : `<p><em>El contacto de este anuncio está oculto.</em></p>`}
  `;
}

function mostrarContacto(email, telefono) {
  alert(`📧 Email: ${email || "No disponible"}\n📞 Teléfono: ${telefono || "No disponible"}`);
}

cargarDetalle();
