// js/app.js
// Orquestra carregamento de componentes, inicialização de UI e lógica de catálogo.

const loadComponent = async (containerId, path) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Falha ao carregar componente (${res.status})`);
    }
    const html = await res.text();
    container.innerHTML = html;
  } catch (error) {
    // Fallback: usa o HTML já presente no arquivo (offline / file://).
    console.warn(`Não foi possível carregar ${path}:`, error);
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("component-header", "components/header.html"),
    loadComponent("component-banner", "components/banner.html"),
    loadComponent("component-products", "components/products.html"),
    loadComponent("component-cart-modal", "components/cart-modal.html"),
    loadComponent("component-footer", "components/footer.html"),
  ]);

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
});
