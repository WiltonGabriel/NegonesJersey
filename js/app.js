// js/app.js
// Orquestra inicialização de UI e lógica de catálogo sem fetch.

(async () => {
  // Como agora o HTML está chumbado no documento, inicializamos a UI e o carrinho.
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
