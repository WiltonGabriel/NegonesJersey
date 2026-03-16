/* ui.js
   - Inicializa UI global (menu mobile, sliders, links, etc.)
*/

window.NEGO_UI = {
  initMobileMenu() {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mainNav = document.querySelector(".main-nav");

    const setMenuOpen = (open) => {
      if (!mobileToggle || !mainNav) return;
      mobileToggle.setAttribute("aria-expanded", String(open));
      mainNav.classList.toggle("open", open);
    };

    mobileToggle?.addEventListener("click", (event) => {
      event.stopPropagation();
      setMenuOpen(!mainNav.classList.contains("open"));
    });

    document.addEventListener("click", (event) => {
      if (!mainNav?.classList.contains("open")) return;
      const target = event.target;
      if (target instanceof Node && !mainNav.contains(target) && !mobileToggle?.contains(target)) {
        setMenuOpen(false);
      }
    });
  },

  initHeroSlider() {
    const slides = Array.from(document.querySelectorAll(".hero-slider .slide"));
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");
    let current = 0;

    const setSlide = (index) => {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === current);
      });
    };

    prevBtn?.addEventListener("click", () => setSlide(current - 1));
    nextBtn?.addEventListener("click", () => setSlide(current + 1));

    let autoSlide = window.setInterval(() => setSlide(current + 1), 6000);
    [prevBtn, nextBtn].forEach((btn) =>
      btn?.addEventListener("click", () => {
        window.clearInterval(autoSlide);
        autoSlide = window.setInterval(() => setSlide(current + 1), 6000);
      })
    );
  },

  updateWhatsappLinks() {
    const number = window.NEGO_CONFIG?.whatsapp?.number;
    if (!number) return;
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => {
      a.href = `https://wa.me/${number}`;
    });
  },

  renderProductCard(product) {
    const root = document.createElement("article");
    root.className = "product-card";
    root.dataset.productId = product.id;

    const tagsHtml = (product.tags || []).map((tag) => `<span class="product-card__tag">${tag}</span>`).join("");

    root.innerHTML = `
      <span class="badge ${product.badge ? "badge-" + product.badge.toLowerCase() : ""}">${product.badge || ""}</span>
      <div class="product-card__image" aria-hidden="true" style="background-image: url('${product.images[0]}');"></div>
      <div class="product-card__body">
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__sub">${product.description}</p>
        ${tagsHtml ? `<div class="product-card__tags">${tagsHtml}</div>` : ""}
        <p class="product-card__price">${product.currency} ${product.price.toFixed(2)}</p>
        <div class="product-card__actions">
          <a class="product-card__button" href="./product.html?id=${encodeURIComponent(product.id)}">Ver produto</a>
          <button class="product-card__button" type="button" data-action="add-to-cart">Adicionar</button>
        </div>
      </div>
    `;

    root.querySelector("[data-action='add-to-cart']")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const size = product.sizes?.[0] || "P";
      window.NEGO_CART.add(product.id, size, 1);
      window.NEGO_CART.open();
    });

    return root;
  },

  async renderGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = await window.NEGO_PRODUCTS.load();
    container.innerHTML = "";

    products.forEach((product) => {
      container.appendChild(this.renderProductCard(product));
    });

    if (window.NEGO_CART) {
       window.NEGO_CART.updateBadge();
    }
  },

  init() {
    this.initMobileMenu();
    this.initHeroSlider();
    this.updateWhatsappLinks();
  },
};
