// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKdQaX27zlOWU0xwCRJPscaQR5FiqjD80",
  authDomain: "inmobiliaria-cr.firebaseapp.com",
  projectId: "inmobiliaria-cr",
  storageBucket: "inmobiliaria-cr.firebasestorage.app",
  messagingSenderId: "594252224879",
  appId: "1:594252224879:web:6321a05511f67e2d13309a",
  measurementId: "G-21HRE9SEVG"
};
// Initialize Firebase
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var db = firebase.firestore();
var storage = firebase.storage();
var auth = firebase.auth();
