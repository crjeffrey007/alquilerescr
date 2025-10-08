import { db, storage, auth } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const form = document.getElementById("form-anuncio");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const ubicacion = document.getElementById("ubicacion").value;
  const imagenFile = document.getElementById("imagen").files[0];

  try {
    let imageUrl = "";
    if (imagenFile) {
      const storageRef = ref(storage, `anuncios/${imagenFile.name}`);
      await uploadBytes(storageRef, imagenFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "anuncios"), {
      tipo,
      titulo,
      descripcion,
      precio,
      ubicacion,
      imageUrl,
      fecha: serverTimestamp(),
      usuario: auth.currentUser?.email || "anónimo",
    });

    mensaje.textContent = "Anuncio publicado con éxito ✅";
    form.reset();
  } catch (error) {
    mensaje.textContent = "Error: " + error.message;
  }
});
