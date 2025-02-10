function adicionarCarrinho(botao){
    // Encontra o contêiner correto do produto usando closest()
    const produtoDiv = botao.closest('div[aria-checked="produto"]');

    // Verifica se produtoDiv foi encontrado
    if (!produtoDiv) {
        console.error('Elemento pai do produto não encontrado.');
        return;
    }

    //Procura dentro da variavel produtoDiv a classe correspondente .tanannan, e pega o valor dela
    const nome = produtoDiv.querySelector('.nome').innerText;
    const preco = produtoDiv.querySelector('.preco').innerText.replace('Valor: ', '').trim();
    const imagem = produtoDiv.querySelector('.imagem').src;

    console.log(`Nome: ${nome}, Preço: ${preco}, Imagem: ${imagem}`);

    let ultimoId = parseInt(localStorage.getItem('ultimoId')) || 0;
    const novoId = ultimoId + 1;
    localStorage.setItem('ultimoId', novoId);  // Atualiza o último ID no localStorage

    // Cria o objeto do produto com o ID único
    const produto = {
        id: novoId,
        nome: nome,
        preco: preco,
        imagem: imagem
    };

    //Adiciona no localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho.push(produto);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        mostrarCarrinho();

        alert(`Produto "${nome}" adicionado ao carrinho!`);
}

function mostrarCarrinho() {
    const listaCompras = document.querySelector('.minhasCompras');
    listaCompras.innerHTML = '';  // Limpa a lista antes de mostrar os itens

    let carrinho = [];
    try {
        carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    } catch (e) {
        console.error("Erro ao carregar o carrinho:", e);
        carrinho = [];
    }

    // Adiciona cada item do carrinho à lista
    carrinho.forEach(produto => {
        const itemHTML = `
            <li style="margin-bottom: 10px;">
                <img src="${produto.imagem}" alt="${produto.nome}" width="50" style="margin-right: 10px;"> </br>
                <strong>${produto.nome}</strong> - R$ ${produto.preco}
                <span class="id">${produto.id}</span>
                <button class="btn btn-dark" onclick="removerItem(this)">Remover item</button>
            </li>
        `;
        listaCompras.innerHTML += itemHTML;
    });
}

function removerItem(botao) {
    const item = botao.closest('li');
    const id = parseInt(item.querySelector('span').innerText);  // Converte o ID para número

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Filtra os produtos e mantém apenas os que não têm o ID selecionado
    carrinho = carrinho.filter(produto => produto.id !== id);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    mostrarCarrinho();  // Atualiza a interface
}
