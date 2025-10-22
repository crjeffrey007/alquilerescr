// js/publicar-alquiler.js
import { subirVarias } from "./cloudinary-upload.js";

// globals from firebase-config.js: db, auth
const form = document.getElementById("formAlquiler");
const preview = document.getElementById("preview");
const mensaje = document.getElementById("mensaje");

document.getElementById("imagenes").addEventListener("change", (e) => {
  preview.innerHTML = "";
  Array.from(e.target.files).slice(0,50).forEach(file => { // ilimitado, pero prevenimos UI exceso
    const img = document.createElement("img"); img.src = URL.createObjectURL(file); img.className="miniatura";
    preview.appendChild(img);
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!auth.currentUser) { alert("Debes iniciar sesión para publicar."); return; }

  mensaje.textContent = "Subiendo imágenes...";
  const files = document.getElementById("imagenes").files;
  const imagenes = files.length ? await subirVarias(files) : [];

  mensaje.textContent = "Guardando anuncio...";

  const data = Object.fromEntries(new FormData(form).entries());

  // checkbox groups: convert to arrays
  function getChecked(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i=>i.value);
  }

  const anuncio = {
    ...data,
    instalaciones: getChecked("instalaciones"),
    muebles: getChecked("muebles"),
    servicios: getChecked("servicios"),
    imagenes,
    activo: data.activo === "true",
    uid: auth.currentUser.uid,
    estado: "pendiente", // pendiente para aprovación admin
    fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp()
  };

  await db.collection("alquileres").add(anuncio);

  // notificar admin vía Web3Forms
  fetch("https://api.web3forms.com/submit", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      access_key: "36e1e635-e0fa-4b58-adba-4daf2694b7dd",
      subject: "Nuevo anuncio de alquiler pendiente",
      from_name: anuncio.nombre,
      from_email: anuncio.email,
      message: `Nuevo alquiler: ${anuncio.titulo} - ${anuncio.direccion} (${anuncio.provincia})`
    })
  }).catch(()=>{});

  mensaje.textContent = "✅ Anuncio enviado y pendiente de aprobación.";
  form.reset(); preview.innerHTML = "";
});
