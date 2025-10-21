// === CONFIGURACIÓN GENERAL ===
const CLOUD_NAME = "media-anuncios";
const UPLOAD_PRESET = "malos-inquilinos";
const WEB3_ACCESS_KEY = "36e1e635-e0fa-4b58-adba-4daf2694b7dd";

const form = document.getElementById("form-venta");
const inputImagenes = document.getElementById("imagenes");
const preview = document.getElementById("preview");
let imagenesSubidas = [];

// === SUBIR IMÁGENES A CLOUDINARY ===
inputImagenes.addEventListener("change", async (e) => {
  const archivos = e.target.files;
  preview.innerHTML = "";

  for (const archivo of archivos) {
    const data = new FormData();
    data.append("file", archivo);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: data,
    });

    const file = await res.json();
    imagenesSubidas.push(file.secure_url);

    const img = document.createElement("img");
    img.src = file.secure_url;
    img.classList.add("preview-img");
    preview.appendChild(img);
  }
});

// === ENVIAR FORMULARIO A WEB3FORMS ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  formData.append("access_key", WEB3_ACCESS_KEY);
  formData.append("imagenes", imagenesSubidas.join(", "));

  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });

  if (response.ok) {
    alert("✅ Tu anuncio de venta fue enviado correctamente.");
    form.reset();
    imagenesSubidas = [];
    preview.innerHTML = "";
    window.location.href = "gracias.html";
  } else {
    alert("❌ Error al enviar el formulario. Intenta nuevamente.");
  }
});
