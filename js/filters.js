/* filters.js
   - Controladores de filtro de busca, categorias e tags do grid de produtos.
*/

window.NEGO_FILTERS = {
  async init() {
    const header = document.querySelector(".products__header");
    if (!header) return;

    // Dependência de carregamento
    const products = await window.NEGO_PRODUCTS.load();
    
    const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    const tags = Array.from(
      new Set(products.flatMap((p) => (Array.isArray(p.tags) ? p.tags : [])))
    ).filter(Boolean);

    const controls = document.createElement("div");
    controls.className = "products__filters";
    controls.innerHTML = `
      <div class="filter-group">
        <input id="productSearch" class="input" type="search" placeholder="Buscar produto..." />
      </div>
      <div class="filter-group">
        <label for="productCategory" class="sr-only">Filtrar por categoria</label>
        <select id="productCategory" class="select">
          <option value="">Todas as categorias</option>
          ${categories.map((cat) => `<option value="${cat}">${cat}</option>`).join("")}
        </select>
      </div>
      <div class="filter-group tags">
        ${tags.map((tag) => `<button type="button" class="tag-btn" data-tag="${tag}">${tag}</button>`).join("")}
      </div>
    `;

    header.appendChild(controls);

    const searchInput = document.getElementById("productSearch");
    const categorySelect = document.getElementById("productCategory");
    const tagButtons = Array.from(document.querySelectorAll(".tag-btn"));
    const activeTags = new Set();

    const applyFilters = () => {
      const query = searchInput.value.trim().toLowerCase();
      const category = categorySelect.value;
      const grid = document.querySelector("#productGrid"); // mudou no HTML de div.grid pra productGrid direto
      const cards = grid?.querySelectorAll(".product-card");

      cards?.forEach((card) => {
        const title = card.querySelector(".product-card__title")?.textContent?.toLowerCase() || "";
        const desc = card.querySelector(".product-card__sub")?.textContent?.toLowerCase() || "";
        const matchesQuery = !query || title.includes(query) || desc.includes(query);
        
        const prod = products.find((p) => p.id === card.dataset.productId);
        const matchesCategory = !category || prod?.category === category;
        const itemTags = Array.isArray(prod?.tags) ? prod.tags : [];
        const matchesTags = activeTags.size === 0 || itemTags.some((tag) => activeTags.has(tag));

        // Use flex/block instead of grid depending on your base css, we'll assume flex or flex fallback 
        // wait, products.css says .product-card is flex, the wrapper .products__grid is grid.
        // the display for the item itself should be flex if it was flex. Let's use '' to reset to stylesheet default.
        if(matchesQuery && matchesCategory && matchesTags) {
             card.style.display = "";
        } else {
             card.style.display = "none";
        }
      });
    };

    tagButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.dataset.tag;
        if (!tag) return;
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          btn.classList.remove("active");
        } else {
          activeTags.add(tag);
          btn.classList.add("active");
        }
        applyFilters();
      });
    });

    searchInput.addEventListener("input", applyFilters);
    categorySelect.addEventListener("change", applyFilters);
  }
};
