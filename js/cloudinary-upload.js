// js/cloudinary-upload.js
const CLOUD_NAME = "media-anuncios";
const UPLOAD_PRESET = "alquilerescr";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/** sube un archivo File a Cloudinary y devuelve secure_url */
export async function subirImagen(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
  const json = await res.json();
  if (json.secure_url) return json.secure_url;
  throw new Error("Error subiendo imagen: " + (json.error?.message || JSON.stringify(json)));
}

/** sube múltiples archivos y devuelve array de URLs */
export async function subirVarias(files) {
  const urls = [];
  for (const f of files) {
    const url = await subirImagen(f);
    urls.push(url);
  }
  return urls;
}
