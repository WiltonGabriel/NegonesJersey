/* cart.js
   - Gerencia o carrinho local (localStorage)
   - Renderiza modal de carrinho e interações
*/

window.NEGO_CART = {
  _storageKey() {
    return window.NEGO_CONFIG.storageKeys.cart;
  },

  _normalize(raw) {
    if (!raw) return [];
    try {
      const value = JSON.parse(raw);
      if (Array.isArray(value)) return value;
      if (typeof value === "object" && value !== null) {
        return Object.entries(value)
          .map(([id, qty]) => ({ id, size: "P", qty: Number(qty) || 0 }))
          .filter((item) => item.qty > 0);
      }
      return [];
    } catch {
      return [];
    }
  },

  get() {
    const raw = localStorage.getItem(this._storageKey());
    return this._normalize(raw);
  },

  set(items) {
    localStorage.setItem(this._storageKey(), JSON.stringify(items));
  },

  getCount() {
    return this.get().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  },

  add(productId, size = "P", qty = 1) {
    if (!productId) return;
    const cart = this.get();
    const key = `${productId}::${size}`;
    const existing = cart.find((item) => `${item.id}::${item.size}` === key);
    if (existing) {
      existing.qty = (Number(existing.qty) || 0) + qty;
    } else {
      cart.push({ id: productId, size, qty });
    }
    this.set(cart);
    this.updateBadge();
  },

  setQuantity(productId, size, qty) {
    const cart = this.get();
    const key = `${productId}::${size}`;
    const idx = cart.findIndex((item) => `${item.id}::${item.size}` === key);
    if (idx < 0) return;
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
    this.set(cart);
    this.updateBadge();
  },

  remove(productId, size) {
    const cart = this.get().filter((item) => !(item.id === productId && item.size === size));
    this.set(cart);
    this.updateBadge();
  },

  clear() {
    this.set([]);
    this.updateBadge();
  },

  updateBadge() {
    const badge = document.querySelector(".cart-badge");
    if (!badge) return;
    const count = this.getCount();
    badge.textContent = String(count);
    badge.setAttribute("aria-label", `${count} itens no carrinho`);
  },

  async renderModal() {
    const modal = document.getElementById("cartModal");
    if (!modal) return;

    const container = modal.querySelector(".cart-items");
    const products = await window.NEGO_PRODUCTS.load();
    const cart = this.get();

    if (!cart.length) {
      container.innerHTML = `<p class="muted">Seu carrinho está vazio.</p>`;
      modal.querySelector(".cart-total").textContent = "R$ 0,00";
      return;
    }

    const map = products.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    const fragment = document.createDocumentFragment();

    cart.forEach((item) => {
      const product = map[item.id];
      if (!product) return;
      const lineTotal = (product.price || 0) * (Number(item.qty) || 0);

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.dataset.productId = item.id;
      itemEl.dataset.size = item.size;

      itemEl.innerHTML = `
        <div class="cart-item-info">
          <div>
            <strong>${product.name}</strong>
            <div class="muted">Tamanho: ${item.size}</div>
          </div>
          <div class="cart-item-controls">
            <button type="button" class="icon-btn" data-action="decrease" aria-label="Diminuir quantidade">−</button>
            <span class="cart-qty" aria-live="polite">${item.qty}</span>
            <button type="button" class="icon-btn" data-action="increase" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <div class="cart-item-meta">
          <span class="cart-item-price">R$ ${(product.price || 0).toFixed(2)}</span>
          <span class="cart-item-line">R$ ${lineTotal.toFixed(2)}</span>
          <button type="button" class="btn btn-outline btn-sm" data-action="remove">Remover</button>
        </div>
      `;

      fragment.appendChild(itemEl);
    });

    container.innerHTML = "";
    container.appendChild(fragment);

    modal.querySelector(".cart-total").textContent = `R$ ${this.getTotal(products).toFixed(2)}`;
  },

  getTotal(products) {
    const map = (products || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    return this.get().reduce((total, item) => {
      const product = map[item.id];
      if (!product) return total;
      return total + (product.price || 0) * (Number(item.qty) || 0);
    }, 0);
  },

  open() {
    const modal = document.getElementById("cartModal");
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("open");
    this.renderModal();
  },

  close() {
    const modal = document.getElementById("cartModal");
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("open");
  },

  init() {
    const modal = document.getElementById("cartModal");
    if (!modal) return;

    modal.addEventListener("click", async (event) => {
      const action = (event.target.closest("[data-action]") || {}).dataset.action;
      if (!action) return;

      const itemEl = event.target.closest(".cart-item");
      const productId = itemEl?.dataset.productId;
      const size = itemEl?.dataset.size;

      if (action === "close-cart") {
        this.close();
        return;
      }

      if (action === "clear-cart") {
        this.clear();
        return;
      }

      if (action === "send-cart") {
        const products = await window.NEGO_PRODUCTS.load();
        window.open(window.NEGO_WHATSAPP.buildCartUrl(this.get(), products), "_blank");
        return;
      }

      if (!productId || !size) return;

      if (action === "increase") {
        const qty = Number(itemEl.querySelector(".cart-qty")?.textContent || 0) + 1;
        this.setQuantity(productId, size, qty);
      }

      if (action === "decrease") {
        const qty = Number(itemEl.querySelector(".cart-qty")?.textContent || 0) - 1;
        this.setQuantity(productId, size, qty);
      }

      if (action === "remove") {
        this.remove(productId, size);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.close();
    });

    document.querySelectorAll("[data-action='open-cart']").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        this.open();
      });
    });

    this.updateBadge();
  },
};
