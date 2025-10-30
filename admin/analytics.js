// analytics.js
// Reemplaza GA_PROPERTY_ID y API_KEY por tus credenciales.
// Nota: usar API Key en frontend tiene riesgos; preferible usar Cloud Function como proxy.
const GA_PROPERTY_ID = "TU_PROPERTY_ID";
const API_KEY = "TU_API_KEY_ANALYTICS";

async function fetchReport(body){
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport?key=${API_KEY}`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return res.ok ? await res.json() : { error: true, status: res.status, text: await res.text() };
}

async function loadAnalytics(){
  const visitas = await fetchReport({
    dateRanges:[{startDate:'7daysAgo', endDate:'today'}],
    dimensions:[{name:'date'}],
    metrics:[{name:'activeUsers'}]
  });

  const paises = await fetchReport({
    dateRanges:[{startDate:'30daysAgo', endDate:'today'}],
    dimensions:[{name:'country'}],
    metrics:[{name:'activeUsers'}],
    limit:10
  });

  renderCharts(visitas, paises);
}

function renderCharts(visitas, paises){
  try{
    if(!visitas.rows || !paises.rows) {
      document.getElementById('analyticsContainer').innerHTML = '<p>No se obtuvieron datos (ver consola)</p>';
      console.warn('Analytics error', visitas, paises);
      return;
    }
    const labels = visitas.rows.map(r=>r.dimensionValues[0].value);
    const data = visitas.rows.map(r=>Number(r.metricValues[0].value));

    const ctx1 = document.getElementById('visitasChart').getContext('2d');
    new Chart(ctx1, {
      type:'line',
      data:{ labels, datasets:[{ label:'Usuarios activos', data, borderColor:'#0f3b77', tension:0.3 }]},
      options:{ responsive:true }
    });

    const labels2 = paises.rows.map(r=>r.dimensionValues[0].value);
    const data2 = paises.rows.map(r=>Number(r.metricValues[0].value));
    const ctx2 = document.getElementById('paisesChart').getContext('2d');
    new Chart(ctx2, {
      type:'bar',
      data:{ labels:labels2, datasets:[{ label:'Usuarios por país', data:data2, backgroundColor:'#0f3b77' }]},
      options:{ responsive:true }
    });
  }catch(e){
    console.error(e);
    document.getElementById('analyticsContainer').innerHTML = '<p>Error renderizando gráficas</p>';
  }
}

// iniciar
loadAnalytics();
