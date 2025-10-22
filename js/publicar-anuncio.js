const CLOUD_NAME = "media-anuncios";
const UPLOAD_PRESET = "alquilerescr";
const WEB3FORMS_KEY = "36e1e635-e0fa-4b58-adba-4daf2694b7dd";

const form = document.getElementById("formAnuncio");
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
  mensaje.textContent = "Subiendo anuncio...";

  const data = Object.fromEntries(new FormData(form).entries());
  const imagenes = form.imagenes.files;
  const logo = form.logo.files[0];
  const urls = [];

  // Subir logo (si existe)
  let logoUrl = "";
  if (logo) {
    const fd = new FormData();
    fd.append("file", logo);
    fd.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: fd,
    });
    const fileData = await res.json();
    logoUrl = fileData.secure_url;
  }

  // Subir imágenes
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
    tipo: data.tipo,
    titulo: data.titulo,
    descripcion: data.descripcion,
    negocio: data.negocio,
    telefono: data.telefono,
    email: data.email,
    logo: logoUrl,
    imagenes: urls,
    nombre: data.nombre,
    horario: data.horario,
    direccion: data.direccion,
    distrito: data.distrito,
    canton: data.canton,
    provincia: data.provincia,
    pais: data.pais,
    domicilio: data.domicilio,
    categoria: data.categoria,
    activo: data.activo === "true",
    fecha: new Date().toISOString(),
  };

  await db.collection("anuncios").add(anuncio);

  // Enviar notificación con Web3Forms
  await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: "Nuevo anuncio comercial publicado",
      from_name: "Alquileres CR",
      message: `
        <b>${anuncio.titulo}</b><br>
        Categoría: ${anuncio.categoria}<br>
        Tipo: ${anuncio.tipo}<br>
        Contacto: ${anuncio.telefono} | ${anuncio.email || 'N/A'}<br>
        Publicado el: ${new Date().toLocaleDateString()}
      `,
    }),
  });

  mensaje.textContent = "✅ Anuncio publicado correctamente.";
  form.reset();
  previewDiv.innerHTML = "";
});

console.log("✅ publicar-anuncio.js cargado correctamente.");
