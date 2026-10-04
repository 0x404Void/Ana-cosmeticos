/* ============================================
   Ana Cosméticos — JavaScript
   ============================================ */

// Número do WhatsApp da loja (código do país + DDD + número, sem espaços)
const WHATSAPP = "5588996869920";

// ============================================
// LISTA DE PRODUTOS — EDITE AQUI
// Para adicionar um produto, copie uma linha e mude:
// ["Nome do produto", "Marca", "Categoria", "../imagens/foto.jpg"],
// Se não tiver foto, deixe "" no lugar do caminho da imagem.
// Categorias disponíveis: "Perfumes Femininos", "Perfumes Masculinos",
// "Cuidados com a Pele", "Kits Presente"
// ============================================
const produtos = [
  ["Egeo Dolce", "O Boticário", "Perfumes Femininos", "../imagens/ego-dolce1.webp"],
  ["Lily Eau de Parfum", "O Boticário", "Perfumes Femininos", "../imagens/lily-eau.webp"],
  ["Essencial Exclusivo", "Natura", "Perfumes Femininos", "../imagens/essencial-exclusivo.webp"],
  ["Malbec Gold", "O Boticário", "Perfumes Masculinos", "../imagens/malbec-gold.webp"],
  ["Kaiak Masculino", "Natura", "Perfumes Masculinos", "../imagens/kaiak-oceano.webp"],
  ["Club 6 Voyage", "Eudora", "Perfumes Masculinos", "../imagens/club-6.webp"],
  ["Chronos Sérum", "Natura", "Cuidados com a Pele", "../imagens/chronos.webp"],
  ["Renew Ultimate", "Avon", "Cuidados com a Pele", "../imagens/renew.webp"],
  ["Kit Presente Floratta", "O Boticário", "Kits Presente", "../imagens/kit-floratta.webp"],
  ["Kit Siàge Nutri", "Eudora", "Kits Presente", "../imagens/kit-siage.webp"],
];

// Monta o link do WhatsApp com uma mensagem pronta
function linkWhatsApp(mensagem) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensagem);
}

// ============================================
// CARRINHO
// carrinho = { idDoProduto: quantidade }
// O id é a posição do produto na lista "produtos" acima.
// ============================================
let carrinho = {};

// Recupera o carrinho salvo no navegador (se houver)
try {
  carrinho = JSON.parse(localStorage.getItem("carrinhoAna")) || {};
} catch (e) {
  carrinho = {};
}

function salvarCarrinho() {
  try {
    localStorage.setItem("carrinhoAna", JSON.stringify(carrinho));
  } catch (e) {}
}

function totalItens() {
  return Object.values(carrinho).reduce((soma, qtd) => soma + qtd, 0);
}

function adicionarAoCarrinho(id) {
  carrinho[id] = (carrinho[id] || 0) + 1;
  atualizarCarrinho();
}

function alterarQuantidade(id, mudanca) {
  carrinho[id] = (carrinho[id] || 0) + mudanca;
  if (carrinho[id] <= 0) delete carrinho[id];
  atualizarCarrinho();
}

function limparCarrinho() {
  carrinho = {};
  atualizarCarrinho();
}

// Atualiza contador, lista de itens e link do WhatsApp
function atualizarCarrinho() {
  salvarCarrinho();

  const total = totalItens();
  const contador = document.getElementById("contadorCarrinho");
  contador.textContent = total;
  contador.classList.toggle("vazio", total === 0);
  document.getElementById("carrinhoTotal").textContent = total;

  const itens = document.getElementById("carrinhoItens");
  const finalizar = document.getElementById("finalizarPedido");
  const ids = Object.keys(carrinho).filter((id) => produtos[id]);

  if (ids.length === 0) {
    itens.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.<br />Adicione produtos do catálogo!</p>`;
    finalizar.classList.add("desativado");
    finalizar.removeAttribute("href");
    document.getElementById("limparCarrinho").style.display = "none";
    return;
  }

  itens.innerHTML = ids
    .map((id) => {
      const [nome, marca] = produtos[id];
      return `
        <div class="item-carrinho">
          <div>
            <p>${marca}</p>
            <h4>${nome}</h4>
          </div>
          <div class="quantidade">
            <button data-id="${id}" data-acao="menos" aria-label="Diminuir">−</button>
            <span>${carrinho[id]}</span>
            <button data-id="${id}" data-acao="mais" aria-label="Aumentar">+</button>
          </div>
        </div>`;
    })
    .join("");

  // Mensagem do pedido para o WhatsApp
  let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
  ids.forEach((id) => {
    const [nome, marca] = produtos[id];
    mensagem += `• ${carrinho[id]}x ${nome} (${marca})\n`;
  });
  mensagem += `\nTotal de itens: ${total}`;

  finalizar.classList.remove("desativado");
  finalizar.href = linkWhatsApp(mensagem);
  document.getElementById("limparCarrinho").style.display = "";
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("aberto");
  document.getElementById("carrinhoFundo").classList.add("aberto");
  document.getElementById("carrinho").setAttribute("aria-hidden", "false");
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("aberto");
  document.getElementById("carrinhoFundo").classList.remove("aberto");
  document.getElementById("carrinho").setAttribute("aria-hidden", "true");
}

document.getElementById("btnCarrinho").addEventListener("click", abrirCarrinho);
document.getElementById("fecharCarrinho").addEventListener("click", fecharCarrinho);
document.getElementById("carrinhoFundo").addEventListener("click", fecharCarrinho);
document.getElementById("limparCarrinho").addEventListener("click", limparCarrinho);
document.addEventListener("keydown", (e) => e.key === "Escape" && fecharCarrinho());

// Botões + e − dentro do carrinho
document.getElementById("carrinhoItens").addEventListener("click", (e) => {
  const botao = e.target.closest("button[data-id]");
  if (!botao) return;
  alterarQuantidade(botao.dataset.id, botao.dataset.acao === "mais" ? 1 : -1);
});

// ============================================
// CATÁLOGO
// ============================================

// Desenha os cartões de produto na tela
function mostrarProdutos(categoria) {
  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = "";

  produtos.forEach(([nome, marca, cat, foto], id) => {
    if (categoria !== "Todos" && cat !== categoria) return;

    const cartao = document.createElement("article");
    cartao.className = "cartao-produto revelar visivel";

    const imagem = foto
      ? `<img src="${foto}" alt="${nome}" />`
      : `<span class="letra-produto">${nome.charAt(0)}</span>`;

    cartao.innerHTML = `
      <div class="foto-produto">${imagem}</div>
      <p class="marca-produto">${marca}</p>
      <h3>${nome}</h3>
      <p class="categoria-produto">${cat}</p>
      <button class="btn btn-marinho" data-id="${id}">🛒 Adicionar ao carrinho</button>
    `;
    lista.appendChild(cartao);
  });
}

// Clique em "Adicionar ao carrinho"
document.getElementById("listaProdutos").addEventListener("click", (e) => {
  const botao = e.target.closest("button[data-id]");
  if (!botao) return;

  adicionarAoCarrinho(botao.dataset.id);

  // Feedback visual no botão e no ícone do carrinho
  botao.textContent = "✓ Adicionado!";
  botao.classList.add("adicionado");
  setTimeout(() => {
    botao.textContent = "🛒 Adicionar ao carrinho";
    botao.classList.remove("adicionado");
  }, 1200);

  const iconeCarrinho = document.getElementById("btnCarrinho");
  iconeCarrinho.classList.remove("pulo");
  void iconeCarrinho.offsetWidth; // reinicia a animação
  iconeCarrinho.classList.add("pulo");
});

// Botões de filtro do catálogo
document.querySelectorAll("#filtros button").forEach((botao) => {
  botao.addEventListener("click", () => {
    document.querySelectorAll("#filtros button").forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    mostrarProdutos(botao.dataset.cat);
  });
});

// Menu do celular (abre e fecha)
const btnMenu = document.getElementById("btnMenu");
const menuMobile = document.getElementById("menuMobile");
btnMenu.addEventListener("click", () => {
  menuMobile.classList.toggle("aberto");
  btnMenu.textContent = menuMobile.classList.contains("aberto") ? "✕" : "☰";
});
menuMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuMobile.classList.remove("aberto");
    btnMenu.textContent = "☰";
  });
});

// Animação: elementos aparecem suavemente ao rolar a página
const observador = new IntersectionObserver(
  (entradas) => entradas.forEach((e) => e.isIntersecting && e.target.classList.add("visivel")),
  { threshold: 0.12 }
);
document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));

// Ano atual no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Carrega os produtos e o carrinho ao abrir a página
mostrarProdutos("Todos");
atualizarCarrinho();