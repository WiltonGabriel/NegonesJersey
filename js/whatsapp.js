/* whatsapp.js
   - Constrói URLs de WhatsApp para pedidos individuais e do carrinho.
*/

window.NEGO_WHATSAPP = {
  buildItemUrl(product, size, qty = 1) {
    const cfg = window.NEGO_CONFIG.whatsapp;
    const msg = cfg.template
      .replace("{name}", product.name)
      .replace("{code}", product.code)
      .replace("{size}", size)
      .replace("{qty}", String(qty))
      .replace("{price}", `${product.currency} ${product.price.toFixed(2)}`);

    return `https://wa.me/${cfg.number}?text=${encodeURIComponent(msg)}`;
  },

  buildCartUrl(cartItems, products) {
    const cfg = window.NEGO_CONFIG.whatsapp;
    const map = (products || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    const itemsText = cartItems
      .map((item) => {
        const product = map[item.id];
        if (!product) return null;
        const total = (product.price || 0) * (Number(item.qty) || 0);
        return `- ${item.qty}x ${product.name} (tamanho ${item.size}): R$ ${total.toFixed(2)}`;
      })
      .filter(Boolean)
      .join("\n");

    const total = cartItems.reduce((sum, item) => {
      const product = map[item.id];
      if (!product) return sum;
      return sum + (product.price || 0) * (Number(item.qty) || 0);
    }, 0);

    const msg = cfg.cartTemplate
      .replace("{items}", itemsText)
      .replace("{total}", `R$ ${total.toFixed(2)}`);

    return `https://wa.me/${cfg.number}?text=${encodeURIComponent(msg)}`;
  },
};
