const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      loginMsg.textContent = "Acceso correcto, redirigiendo...";
      loginMsg.style.color = "green";
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 1000);
    })
    .catch((error) => {
      loginMsg.textContent = "Error: " + error.message;
      loginMsg.style.color = "red";
    });
});
