/* product-page.js
   - Lógica exclusiva para a página individual do produto (Detalhes, imagens, formulário de adição).
*/

window.NEGO_PRODUCT_PAGE = {
  async render(productId) {
    const container = document.getElementById("productPage");
    if (!container) return;

    const products = await window.NEGO_PRODUCTS.load();
    const product = products.find((p) => p.id === productId);
    
    if (!product) {
      container.innerHTML = `<p>Produto não encontrado.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="product-detail">
        <div class="product-images">
          ${product.images
            .map(
              (src, idx) =>
                `<button type="button" class="thumb" data-image="${src}" style="background-image: url('${src}');" aria-label="Ver imagem ${idx + 1}"></button>`
            )
            .join("")}
          <div class="product-main-image" role="img" aria-label="Imagem do produto"></div>
        </div>

        <div class="product-info">
          <h1 class="product-page__title">${product.name}</h1>
          <p class="product-code">Código: ${product.code}</p>
          <p class="product-price">${product.currency} ${product.price.toFixed(2)}</p>
          <p class="product-description">${product.description}</p>

          <div class="product-details">
            <h3>Mais detalhes</h3>
            <p>${product.details}</p>
          </div>

          <div class="product-actions">
            <div class="form-row">
              <div class="form-field">
                <label class="select-label" for="productSize">Tamanho</label>
                <select id="productSize" class="select">
                  ${product.sizes
                    .map((size) => `<option value="${size}">${size}</option>`)
                    .join("")}
                </select>
              </div>
              <div class="form-field">
                <label class="select-label" for="productQty">Quantidade</label>
                <input id="productQty" class="select" type="number" min="1" value="1" />
              </div>
            </div>

            <div class="action-row">
              <button type="button" class="btn btn-primary" id="addToCart">Adicionar ao carrinho</button>
              <button type="button" class="btn btn-outline" id="buyNow">Comprar agora</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Lógica das fotos
    const mainImage = container.querySelector(".product-main-image");
    const updateMainImage = (src) => {
      if (!mainImage) return;
      mainImage.style.backgroundImage = `url('${src}')`;
    };

    const thumbButtons = container.querySelectorAll(".thumb");
    thumbButtons.forEach((btn) => {
      btn.addEventListener("click", () => updateMainImage(btn.dataset.image));
    });

    if (product.images.length > 0) {
      updateMainImage(`${product.images[0]}`);
    }

    // Formulário de compra
    const sizeSelect = container.querySelector("#productSize");
    const qtyInput = container.querySelector("#productQty");

    container.querySelector("#addToCart")?.addEventListener("click", () => {
      const size = sizeSelect.value;
      const qty = Number(qtyInput.value) || 1;
      window.NEGO_CART.add(product.id, size, qty);
      window.NEGO_CART.open();
    });

    container.querySelector("#buyNow")?.addEventListener("click", () => {
      const size = sizeSelect.value;
      const qty = Number(qtyInput.value) || 1;
      window.NEGO_CART.add(product.id, size, qty);
      window.location.href = window.NEGO_WHATSAPP.buildItemUrl(product, size, qty);
    });

    // Atualiza contadores em tela se for preciso
    if(window.NEGO_CART) {
        window.NEGO_CART.updateBadge();
    }
  }
};
