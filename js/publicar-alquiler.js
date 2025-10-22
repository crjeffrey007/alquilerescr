const CLOUD_NAME = "media-anuncios";
const UPLOAD_PRESET = "malos-inquilinos";
const WEB3FORMS_KEY = "36e1e635-e0fa-4b58-adba-4daf2694b7dd";

const form = document.getElementById("formAlquiler");
const mensaje = document.getElementById("mensaje");
const previewDiv = document.getElementById("preview");

form.imagenes.addEventListener("change", (e) => {
  previewDiv.innerHTML = "";
  [...e.target.files].forEach((file) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.classList.add("miniatura");
    previewDiv.appendChild(img);
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "Subiendo anuncio, por favor espere...";

  const data = Object.fromEntries(new FormData(form).entries());
  const imagenes = form.imagenes.files;
  const urls = [];

  // Subir imágenes a Cloudinary
  for (let img of imagenes) {
    const fd = new FormData();
    fd.append("file", img);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: fd,
    });

    const fileData = await res.json();
    urls.push(fileData.secure_url);
  }

  // Guardar en Firestore
  const anuncio = {
    titulo: data.titulo,
    descripcion: data.descripcion,
    areaPropiedad: data.areaPropiedad || "",
    areaConstruccion: data.areaConstruccion || "",
    amoblado: data.amoblado,
    instalaciones: getCheckedValues("instalaciones"),
    muebles: getCheckedValues("muebles"),
    incluyeServicios: data.incluyeServicios,
    servicios: getCheckedValues("servicios"),
    direccion: data.direccion,
    provincia: data.provincia,
    moneda: data.moneda,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    activo: data.activo === "true",
    fecha: new Date().toISOString(),
    imagenes: urls,
  };

  await db.collection("alquileres").add(anuncio);

  // Enviar correo de confirmación con Web3Forms
  await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: "Nuevo anuncio de alquiler publicado",
      from_name: "Alquileres CR",
      message: `
        Se ha publicado un nuevo anuncio:<br>
        <strong>${anuncio.titulo}</strong><br>
        ${anuncio.descripcion}<br>
        Contacto: ${anuncio.email}
      `,
    }),
  });

  mensaje.textContent = "✅ Anuncio publicado correctamente.";
  form.reset();
  previewDiv.innerHTML = "";
});

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (el) => el.value
  );
}
