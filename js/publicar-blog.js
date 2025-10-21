// === CONFIGURACIÓN GENERAL ===
const CLOUD_NAME = "media-anuncios";
const UPLOAD_PRESET = "malos-inquilinos";
const WEB3_ACCESS_KEY = "36e1e635-e0fa-4b58-adba-4daf2694b7dd";

const form = document.getElementById("form-blog");
const inputImagen = document.getElementById("imagen");
const preview = document.getElementById("preview");
let imagenSubida = "";

// === SUBIR IMAGEN DESTACADA ===
inputImagen.addEventListener("change", async (e) => {
  const archivo = e.target.files[0];
  const data = new FormData();
  data.append("file", archivo);
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: "POST",
    body: data,
  });

  const file = await res.json();
  imagenSubida = file.secure_url;
  preview.innerHTML = `<img src="${imagenSubida}" class="preview-img">`;
});

// === ENVIAR FORMULARIO A WEB3FORMS ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  formData.append("access_key", WEB3_ACCESS_KEY);
  formData.append("imagen", imagenSubida);

  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });

  if (response.ok) {
    alert("✅ Tu publicación fue enviada correctamente.");
    form.reset();
    preview.innerHTML = "";
    window.location.href = "gracias.html";
  } else {
    alert("❌ Error al enviar el formulario. Intenta nuevamente.");
  }
});
