// cloudinary-upload.js
const cloudName = "media-anuncios";
const uploadPreset = "alquilerescr";

export async function subirImagen(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
}
