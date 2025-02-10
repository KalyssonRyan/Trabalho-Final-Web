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
    let totalPreco = 0;

    try {
        carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    } catch (e) {
        console.error("Erro ao carregar o carrinho:", e);
        carrinho = [];
    }

    // Verifica se há itens no carrinho
    if (carrinho.length === 0) {
        const vazioHTML = `<p class="carrinho-vazio" style="font-weight: bold;">Carrinho está vazio</p>`;
        listaCompras.innerHTML = vazioHTML;  // Mostra o texto "Carrinho está vazio"
        removerTextoTotalEBotao();  // Remove o total e o botão se não houver itens
        return;
    }

    // Adiciona cada item do carrinho à lista e calcula o total
    carrinho.forEach(produto => {
        totalPreco += parseFloat(produto.preco.replace(',', '.'));

        const itemHTML = `
            <li style="margin-bottom: 10px;">
                <img src="${produto.imagem}" alt="${produto.nome}" width="50" style="margin-right: 10px;"> </br>
                <strong>${produto.nome}</strong> - R$ ${produto.preco}
                <span class="id d-none">${produto.id}</span>
                <button class="btn btn-dark" onclick="removerItem(this)">Remover item</button>
            </li>
        `;
        listaCompras.innerHTML += itemHTML;
    });

    // Mostra o total e o botão "COMPRAR"
    exibirTotalEBotao(totalPreco);
}

function exibirTotalEBotao(totalPreco) {
    let totalElement = document.querySelector('.total-compra');
    if (!totalElement) {
        // Cria o elemento para o total se ele ainda não existir
        totalElement = document.createElement('p');
        totalElement.classList.add('total-compra');
        totalElement.style.fontWeight = 'bold';
        document.querySelector('.offcanvas-body').appendChild(totalElement);
    }
    totalElement.innerText = `Total: R$ ${totalPreco.toFixed(2).replace('.', ',')}`;

    // Cria dinamicamente o botão "COMPRAR" se não existir ainda
    if (!document.querySelector('.botao-comprar')) {
        const botaoComprar = document.createElement('button');
        botaoComprar.classList.add('btn', 'btn-dark', 'botao-comprar');
        botaoComprar.innerText = 'COMPRAR';
        botaoComprar.onclick = finalizarCompra;  // Define a função que será chamada ao clicar no botão
        document.querySelector('.offcanvas-body').appendChild(botaoComprar);
    }
}

function removerTextoTotalEBotao() {
    const totalElement = document.querySelector('.total-compra');
    const botaoComprar = document.querySelector('.botao-comprar');
    if (totalElement) {
        totalElement.remove();  // Remove o elemento de total, se existir
    }
    if (botaoComprar) {
        botaoComprar.remove();  // Remove o botão "COMPRAR", se existir
    }
}

function finalizarCompra() {
    // Fecha o offcanvas e espera ele terminar de fechar
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) offcanvas.hide();  // Fecha o offcanvas

    // Espera o offcanvas fechar completamente antes de exibir o modal
    offcanvasElement.addEventListener('hidden.bs.offcanvas', function () {
        // Exibe o modal de confirmação
        const modal = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
        modal.show();

        // Limpa o carrinho após mostrar o modal
        localStorage.removeItem('carrinho');
        mostrarCarrinho();  // Atualiza a interface
    }, { once: true });  // Adiciona o evento apenas uma vez
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
