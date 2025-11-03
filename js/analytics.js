// analytics.js — Integración de Google Analytics (sin API)
(function() {
  const GA_ID = 'G-21HRE9SEVG'; // Tu ID de medición de Google Analytics

  // Crear e insertar el script principal de gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // Inicializar dataLayer y configuración
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  console.log("✅ Google Analytics inicializado con ID:", GA_ID);
})();
