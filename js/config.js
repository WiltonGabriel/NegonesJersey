/* Configurações do site (fácil de alterar) */
window.NEGO_CONFIG = {
  whatsapp: {
    // Use apenas números (incluindo o código do país), sem espaços.
    // Exemplo: Brasil +55 11 91234-5678 -> 5511912345678
    number: "559999999999",

    // Mensagem padrão enviada ao cliente para um item específico
    // As placeholders serão substituídas na hora do envio:
    //   {name} - nome do produto
    //   {code} - código do produto
    //   {size} - tamanho selecionado
    //   {qty} - quantidade
    //   {price} - preço unitário em formato 'R$ 123,45'
    template:
      "Olá! Gostaria de comprar {qty}x {name} (código {code}), tamanho {size}. Preço unitário: {price}. Você pode me ajudar?",

    // Mensagem padrão para pedidos com múltiplos itens (carrinho)
    cartTemplate:
      "Olá! Gostaria de fazer um pedido:\n{items}\nTotal: {total}\nPode me ajudar?",
  },

  storageKeys: {
    cart: "negones_cart",
  },
};
