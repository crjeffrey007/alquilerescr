// js/panel-admin.js
import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js';

async function contarDocs(nombreCol) {
  const snap = await getDocs(collection(db, nombreCol));
  return snap.size;
}

async function cargarStats() {
  const totalAlquileres = await contarDocs('alquileres');
  const totalVentas = await contarDocs('ventas');
  const totalAnuncios = await contarDocs('anuncios');
  const totalBlog = await contarDocs('blog');

  document.getElementById('total-alquileres').textContent = totalAlquileres;
  document.getElementById('total-ventas').textContent = totalVentas;
  document.getElementById('total-anuncios').textContent = totalAnuncios;
  document.getElementById('total-blog').textContent = totalBlog;

  const ctx = document.getElementById('graficoGeneral').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Alquileres', 'Ventas', 'Anuncios', 'Blog'],
      datasets: [{
        label: 'Total Publicaciones',
        data: [totalAlquileres, totalVentas, totalAnuncios, totalBlog],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

cargarStats();

// Google Analytics IFRAME
const analyticsIframe = document.getElementById('iframe-analytics');
analyticsIframe.src = 'https://analytics.google.com/analytics/web/?authuser=0#/pXXXXXXXX/reports'; // reemplazar
