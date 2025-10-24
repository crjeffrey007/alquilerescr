const CLOUDINARY_CLOUD = 'media-anuncios';
const CLOUDINARY_PRESET = 'alquilerescr';
const CLOUDINARY_FOLDER = 'alquilerescr';

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  fd.append('folder', CLOUDINARY_FOLDER);
  const res = await fetch(url, { method: 'POST', body: fd });
  const j = await res.json();
  if (j.secure_url) return j.secure_url;
  throw new Error('Cloudinary upload error: ' + JSON.stringify(j));
}

async function uploadMultipleFiles(files) {
  const urls = [];
  for (const f of Array.from(files || [])) urls.push(await uploadToCloudinary(f));
  return urls;
}
