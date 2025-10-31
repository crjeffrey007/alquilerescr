// ===============================
// ESTADÍSTICAS DE GOOGLE ANALYTICS
// ===============================

// 👉 Reemplaza con tu ID de medición (G-XXXXXX)
const MEASUREMENT_ID = "G-TU_ID_DE_ANALYTICS";

// Contenedor
const contentArea = document.getElementById("contentArea");

async function cargarEstadisticas() {
  contentArea.innerHTML = `
    <h2>📊 Estadísticas del Sitio</h2>
    <div class="estadisticas-panel">
      <div class="card-estadistica">
        <h3>Visitas Totales</h3>
        <p id="visitasTotales">Cargando...</p>
      </div>
      <div class="card-estadistica">
        <h3>Usuarios Activos</h3>
        <p id="usuariosActivos">Cargando...</p>
      </div>
      <div class="card-estadistica">
        <h3>Páginas Más Visitadas</h3>
        <ul id="paginasPopulares"></ul>
      </div>
    </div>
  `;

  try {
    // Simulación temporal (hasta configurar la API de Analytics)
    // 🔥 Cuando conectes la API real, reemplazás esta sección
    const visitas = Math.floor(Math.random() * 10000);
    const usuarios = Math.floor(Math.random() * 500);
    const paginas = [
      { titulo: "Alquileres", visitas: 1320 },
      { titulo: "Ventas", visitas: 940 },
      { titulo: "Anuncios", visitas: 712 },
      { titulo: "Blog", visitas: 560 }
    ];

    document.getElementById("visitasTotales").textContent = visitas.toLocaleString();
    document.getElementById("usuariosActivos").textContent = usuarios;
    document.getElementById("paginasPopulares").innerHTML = paginas
      .map(p => `<li>${p.titulo} — ${p.visitas} visitas</li>`)
      .join("");

  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
    contentArea.innerHTML += `<p>Error al obtener estadísticas.</p>`;
  }
}

cargarEstadisticas();
