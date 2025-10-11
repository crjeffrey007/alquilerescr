// js/site-init.js - muestra recientes desde 'publicaciones' con estado 'aprobado'
import { db } from './firebase.js';
import { collection, query, where, orderBy, getDocs, limit } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
export async function mostrarRecientes(){ const cont = document.getElementById('recientes'); if(!cont) return; cont.innerHTML=''; const q = query(collection(db,'publicaciones'), where('estado','==','aprobado'), orderBy('createdAt','desc'), limit(6)); const snap = await getDocs(q); snap.forEach(s=>{ const d=s.data(); cont.innerHTML += `<div class="card"><img src="${d.imagenDestacada||'assets/hero/hero.jpg'}" style="height:140px;object-fit:cover"><h3>${d.titulo}</h3><p>${d.provincia||''}</p></div>`; }); }
mostrarRecientes();