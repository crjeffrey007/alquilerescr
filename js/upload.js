// js/upload.js
export const CLOUDINARY_CLOUD = 'media-anuncios';   // cambia si tu cloud name es otro
export const CLOUDINARY_PRESET = 'alquilerescr';    // tu unsigned upload preset

export async function subirArchivosCloudinary(fileList, tipo = 'image') {
  const urls = [];
  if(!fileList || fileList.length === 0) return urls;
  for (const file of Array.from(fileList)) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    fd.append('folder', 'alquilerescr');

    const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${tipo}/upload`, {
      method: 'POST',
      body: fd
    });
    const j = await resp.json();
    if (j.secure_url) urls.push(j.secure_url);
    else console.warn('Cloudinary error', j);
  }
  return urls;
}
