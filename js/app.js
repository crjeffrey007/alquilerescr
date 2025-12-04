// ===============================================
// CONFIGURA AQUÍ TU URL DE STRAPI
// ===============================================
const API_URL = "https://TU-STRAPI.onrender.com"; 
// Ejemplo: const API_URL = "https://mi-api-strapi.onrender.com";


// ===============================================
// FUNCIÓN PARA CARGAR PROPIEDADES POR CATEGORÍA
// ===============================================
async function loadCategory(slug) {
  const url = `${API_URL}/api/propiedades?filters[categoria][slug][$eq]=${slug}&populate=*`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    const items = json.data;
    const container = document.getElementById("posts");

    if (!container) {
      console.error("No existe el contenedor #posts en este HTML");
      return;
    }

    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = `<p>No hay publicaciones aún.</p>`;
      return;
    }

    items.forEach(item => {
      const p = item.attributes;
      const img = p.imagen?.data?.attributes?.url;

      container.innerHTML += `
        <article class="card">
          <h2>${p.titulo}</h2>
          ${img ? `<img src="${API_URL}${img}" alt="${p.titulo}" />` : ""}
          <p>${p.descripcion}</p>
          <strong>Precio: ${p.precio}</strong>
        </article>
      `;
    });

  } catch (error) {
    console.error("Error cargando categoría:", error);
  }
}



// ===============================================
// FUNCIÓN PARA CARGAR TODAS LAS CATEGORÍAS (opcional)
// ===============================================
async function loadCategories() {
  const url = `${API_URL}/api/categorias`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    console.log("Categorías:", json.data);
    
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
}
