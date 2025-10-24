// Analytics render
const analyticsContainer = document.getElementById("analyticsContainer");

function mostrarEstadisticas() {
  analyticsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <h3>👥 Visitantes</h3>
        <p>+1200</p>
      </div>
      <div class="stat-card">
        <h3>📱 Sesiones activas</h3>
        <p>25</p>
      </div>
      <div class="stat-card">
        <h3>📄 Páginas vistas</h3>
        <p>4,532</p>
      </div>
    </div>
    <iframe
      src="https://analytics.google.com/analytics/web/#/p${'G-21HRE9SEVG'}/reports/home"
      style="width:100%;height:400px;border:0;margin-top:20px;"
    ></iframe>
  `;
}

mostrarEstadisticas();
