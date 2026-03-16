// js/app.js
// Orquestra carregamento de componentes, inicialização de UI e lógica de catálogo.

const loadComponent = (containerId, componentKey) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = window.NEGO_COMPONENTS[componentKey];
  if (html) {
    // Using outerHTML so the div wrapper doesn't break CSS (e.g. body > header)
    container.outerHTML = html;
  } else {
    console.warn(`Componente ${componentKey} não encontrado.`);
  }
};

(async () => {
  // Carregar os componentes de forma síncrona a partir da memória
  loadComponent("component-header", "header");
  loadComponent("component-banner", "banner");
  loadComponent("component-products", "products");
  loadComponent("component-cart-modal", "cartModal");
  loadComponent("component-footer", "footer");

  window.NEGO_UI.init();
  window.NEGO_CART.init();

  const productGrid = document.getElementById("productGrid");
  if (productGrid) {
    if (window.NEGO_FILTERS) await window.NEGO_FILTERS.init();
    if (window.NEGO_UI) await window.NEGO_UI.renderGrid("productGrid");
  }

  const productPage = document.getElementById("productPage");
  if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (window.NEGO_PRODUCT_PAGE) await window.NEGO_PRODUCT_PAGE.render(id);
  }
})();
