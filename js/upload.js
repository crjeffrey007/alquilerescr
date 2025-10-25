// upload.js
export async function subirArchivosCloudinary(files, tipo = "image") {
  const urls = [];
  const cloudName = "media-anuncios";
  const uploadPreset = "alquilerescr";

  for (let file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "alquilerescr");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${tipo}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.secure_url) urls.push(data.secure_url);
  }

  return urls;
}
