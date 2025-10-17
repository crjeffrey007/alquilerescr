// Registro
async function registrar(email, password) {
  try {
    const user = await auth.createUserWithEmailAndPassword(email, password);
    alert("✅ Registro exitoso. Espera aprobación del administrador.");
    await db.collection("usuarios").doc(user.user.uid).set({
      email,
      rol: "pendiente",
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    alert(err.message);
  }
}

// Login
async function login(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("✅ Bienvenido");
    window.location.href = "panel.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
}
