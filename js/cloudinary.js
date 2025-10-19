// cloudinary.js
const cloudName = "malos-inquilinos";
const uploadPreset = "malos-inquilinos";

// Función para subir archivos a Cloudinary
async function uploadImages(files) {
  const uploadedUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    uploadedUrls.push(data.secure_url);
  }

  return uploadedUrls;
}
