// js/publicar-venta.js
import { subirVarias } from "./cloudinary-upload.js";
const form = document.getElementById("formVenta"), preview = document.getElementById("preview"), mensaje = document.getElementById("mensaje");
document.getElementById("imagenes").addEventListener("change", e=>{
  preview.innerHTML=""; Array.from(e.target.files).forEach(f=>{ const img=new Image(); img.src=URL.createObjectURL(f); img.className="miniatura"; preview.appendChild(img); });
});
form.addEventListener("submit", async e=>{
  e.preventDefault();
  if(!auth.currentUser){ alert("Debes iniciar sesión"); return; }
  mensaje.textContent="Subiendo imágenes...";
  const files = document.getElementById("imagenes").files;
  const imagenes = files.length?await subirVarias(files):[];
  mensaje.textContent="Guardando...";
  const data = Object.fromEntries(new FormData(form).entries());
  const anuncio = {
    ...data,
    imagenes,
    activo: data.activo === "true",
    uid: auth.currentUser.uid,
    estado: "pendiente",
    fechaPublicacion: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection("ventas").add(anuncio);
  fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    access_key:"36e1e635-e0fa-4b58-adba-4daf2694b7dd",
    subject:"Nueva propiedad en venta pendiente",
    from_name:anuncio.nombre, from_email:anuncio.email,
    message:`${anuncio.titulo} - ${anuncio.direccion} (${anuncio.provincia})`
  })}).catch(()=>{});
  mensaje.textContent="✅ Publicación enviada y pendiente.";
  form.reset(); preview.innerHTML="";
});
