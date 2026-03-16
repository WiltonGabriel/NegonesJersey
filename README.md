# Negones Jersey - Catálogo Offline

Bem-vindo ao **Negones Jersey**, um catálogo de camisas de futebol (oficiais e retrô) desenvolvido para funcionar completamente offline, sem a necessidade de um servidor web ou conexão contínua.

## Objetivo do Projeto

Este site atua como uma **vitrine digital**. **Não há processamento de pagamentos ou checkout online.**
A experiência de compra foi desenhada para que, ao finalizar o carrinho ou clicar em "Comprar agora" na página do produto, o cliente seja redirecionado diretamente para o **WhatsApp** do vendedor com uma mensagem pré-formatada contendo os itens do pedido e detalhes do carrinho.

## Como Executar

Por ter sido desenvolvido com foco total no uso offline (protocolo `file://`), você **não precisa instalar dependências nem rodar um servidor**.

1. Faça o download ou clone este repositório para o seu computador.
2. Navegue até a pasta do projeto.
3. Dê um clique duplo no arquivo `index.html` para abri-lo no seu navegador (Chrome, Firefox, Safari, Edge, etc.).

Todo o catálogo, filtro de tags, sistema de carrinho e páginas de produto vão carregar de forma instantânea a partir dos arquivos locais.

## Funcionalidades

- **100% Offline:** Sem chamadas Ajax (`fetch()`) para arquivos externos; dados de produtos e componentes da interface (header, footer, modal do carrinho) são gerados localmente via JavaScript. Isso evita completamente os problemas de CORS comuns ao abrir arquivos locais no navegador.
- **Catálogo Dinâmico:** Produtos configurados em `js/products.js`, permitindo filtragem por busca em tempo real e por tags (ex: *seleção*, *novo*, *clássica*).
- **Carrinho de Compras:** Sistema de carrinho de compras que salva o estado localmente e gera um link formatado para o WhatsApp com o pedido completo.

## Estrutura do Projeto

* `index.html` - Página principal do catálogo e vitrine.
* `product.html` - Página de detalhes individuais de cada camisa.
* `assets/` - Logos e imagens dos produtos (arquivos SVG).
* `css/` - Estilos modularizados (header, hero banner, cartões de produtos, etc) com design moderno.
* `js/` - Lógica principal.
  * `app.js` - Inicializa e injeta os componentes na tela.
  * `components.js` - Contém o HTML do Header, Footer, Hero Banner e Carrinho.
  * `products.js` - Base de dados estática do catálogo.
  * `filters.js` - Controle de tags e barra de busca.
  * `ui.js` e `cart.js` - Lógica da interface do usuário e controle do carrinho de compras.
  * `whatsapp.js` - Lógica de montagem de URL para redirecionamento.
