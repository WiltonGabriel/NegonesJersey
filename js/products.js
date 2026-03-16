/* products.js
   - Carrega catálogo de produtos de data/products.json
   - Mantém fallback estático para funcionamento offline na ausência do servidor.
*/

window.NEGO_PRODUCTS = {
  _cache: null,

  fallback: [
    {
      id: "brasil-1970",
      code: "BR1970",
      name: "Brasil 1970",
      category: "retro",
      badge: "RETRO",
      price: 249.9,
      currency: "R$",
      description: "A camisa da Copa de 1970 — um clássico do futebol brasileiro com história e identidade.",
      details:
        "Camisa 100% poliéster leve, costura reforçada e design inspirado no uniforme usado na histórica final de 1970.",
      images: ["assets/images/products/prod-brasil-1970.svg"],
      sizes: ["P", "M", "G", "GG"],
      tags: ["seleção", "clássica"],
    },
    {
      id: "flamengo-2023",
      code: "FLA2023",
      name: "Flamengo 2023",
      category: "oficial",
      badge: "OFICIAL",
      price: 279.9,
      currency: "R$",
      description: "O manto rubro-negro oficial de 2023, com acabamento premium e detalhes especiais.",
      details:
        "Tecido oficial, tecnologia Dry-FIT e padrão moderno. Ideal para quem veste Flamengo com orgulho dentro e fora do campo.",
      images: ["assets/images/products/prod-flamengo-2023.svg"],
      sizes: ["P", "M", "G", "GG"],
      tags: ["clube", "oficial"],
    },
    {
      id: "real-1998",
      code: "RMA1998",
      name: "Real Madrid 1998",
      category: "classico",
      badge: "CLÁSSICO",
      price: 219.9,
      currency: "R$",
      description: "A camisa clássica do Real Madrid de 1998, para quem aprecia tradição e estilo.",
      details:
        "Reedição do uniforme usado em 1998, com gola polo e detalhes dourados, perfeita para colecionadores.",
      images: ["assets/images/products/prod-real-1998.svg"],
      sizes: ["P", "M", "G", "GG"],
      tags: ["europeu", "retrô"],
    },
    {
      id: "palmeiras-2024",
      code: "PAL2024",
      name: "Palmeiras 2024",
      category: "novo",
      badge: "NOVO",
      price: 289.9,
      currency: "R$",
      description: "A nova camisa do Verdão para 2024, com design moderno e conforto absoluto.",
      details:
        "Tecnologia de ventilação avançada e corte pensado para performance. Ideal para treino ou dia a dia.",
      images: ["assets/images/products/prod-palmeiras-2024.svg"],
      sizes: ["P", "M", "G", "GG"],
      tags: ["brasileirão", "novo"],
    },
  ],

  async load() {
    if (this._cache) return this._cache;

    try {
      const response = await fetch("data/products.json");
      if (!response.ok) throw new Error(`status ${response.status}`);
      const json = await response.json();
      if (!Array.isArray(json)) throw new Error("JSON inválido");
      this._cache = json;
      return this._cache;
    } catch (err) {
      console.warn("Não foi possível carregar data/products.json (usando fallback)", err);
      this._cache = this.fallback;
      return this._cache;
    }
  },
};
