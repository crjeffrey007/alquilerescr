// js/blog.js - muestra posts del blog
import { db } from './firebase.js';
import { collection, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
async function cargar(){ const cont = document.getElementById('posts'); if(!cont) return; cont.innerHTML='Cargando...'; const snap = await getDocs(collection(db,'blog')); cont.innerHTML=''; snap.forEach(s=>{ const d=s.data(); cont.innerHTML += `<div class="card"><img src="${d.imagenDestacada||'assets/hero/hero.jpg'}" style="height:140px;object-fit:cover"><h3>${d.titulo}</h3><p>${(d.contenido||'').substring(0,120)}...</p></div>` }); }
document.addEventListener('DOMContentLoaded', cargar);