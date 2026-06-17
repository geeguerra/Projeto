document.addEventListener('DOMContentLoaded', () => {

    carregarProdutos();

    carregarProdutos();
    const selectProduto = document.getElementById("produto");
    const dataInput = document.getElementById("pedido-data");
    const statusSelect = document.getElementById("pedido-status");
    const clienteIdInput = document.getElementById("cliente-id");
    const quantidadeInput = document.getElementById("quantidade");
    const valorInput = document.getElementById("valor-unitario"); 
    const form = document.getElementById('form-pedido');
    const boxLista = document.getElementById("box-lista-itens");
    const precoFinalTexto = document.getElementById("valor-total-geral");


    let produtosDaAPI = [];
    let produtosAdicionadosNoPedido = []; 
    let valorTotalGeralDoPedido = 0;

    async function carregarProdutos() {
        try {
            console.log("Iniciando carregamento dos produtos...");
            const response = await fetch(" http://localhost:5104/api/Produtos");

    const selectProduto = document.getElementById("produto");
    const dataInput = document.getElementById("pedido-data");
    const statusSelect = document.getElementById("pedido-status");
    const clienteIdInput = document.getElementById("cliente-id");
    const quantidadeInput = document.getElementById("quantidade");
    const valorInput = document.getElementById("valor-unitario"); 
    const form = document.getElementById('form-pedido');
    const boxLista = document.getElementById("box-lista-itens");
    const precoFinalTexto = document.getElementById("valor-total-geral");

    let produtosDaAPI = [];
    let produtosAdicionadosNoPedido = []; 
    let valorTotalGeralDoPedido = 0;

    async function carregarProdutos() {
        try {
            console.log("Iniciando carregamento dos produtos...");
            const response = await fetch(" http://localhost:5104/api/Produtos");
            
            produtosDaAPI = await response.json();
            console.log("Produtos recebidos da API:", produtosDaAPI);

            selectProduto.innerHTML = `<option selected disabled value="">Selecionar</option>`;

            produtosDaAPI.forEach(produto => {
                const option = document.createElement("option");
                option.value = produto.id; // Garante a captura correta do ID do produto
                option.textContent = produto.nomeProduto;
                selectProduto.appendChild(option);
            });

        } catch (erro) {
            console.log("Erro ao carregar API:", erro);
            alert("Erro ao carregar produtos");
            produtosDaAPI.forEach(produto => {
                const option = document.createElement("option");
                option.value = produto.id;
                option.textContent = produto.nomeProduto;
                selectProduto.appendChild(option);
            });

        } catch (erro) {
            console.log("Erro ao carregar API:", erro);
            alert("Erro ao carregar produtos");
        }
    }

    function exibirPrecoUnitario() {
        if (!selectProduto || !valorInput) return;

        const produtoSelecionado = produtosDaAPI.find(p => p.id == selectProduto.value);
        const precoUnitario = produtoSelecionado ? (produtoSelecionado.preco || 0) : 0;

    function exibirPrecoUnitario() {
        if (!selectProduto || !valorInput) return;

        const produtoSelecionado = produtosDaAPI.find(p => p.id == selectProduto.value);
        const precoUnitario = produtoSelecionado ? (produtoSelecionado.preco || 0) : 0;

        if (precoUnitario > 0) {
            valorInput.value = precoUnitario.toFixed(2);
        } else {
            valorInput.value = "";
        if (precoUnitario > 0) {
            valorInput.value = precoUnitario.toFixed(2);
        } else {
            valorInput.value = "";
        }
    }

    if (selectProduto) selectProduto.addEventListener('change', exibirPrecoUnitario);


    const btnMais = document.querySelector('.btn-add');

    if (btnMais) {
        btnMais.addEventListener('click', (e) => {
            e.preventDefault();

            const produtoSelecionado = produtosDaAPI.find(p => p.id == selectProduto.value);
            const qtd = parseInt(quantidadeInput.value) || 0;

            if (!produtoSelecionado || qtd <= 0) {
                alert("Selecione um produto válido e defina a quantidade!");
                return;
            }
    }

    if (selectProduto) selectProduto.addEventListener('change', exibirPrecoUnitario);

    const btnMais = document.querySelector('.btn-add');
    if (btnMais) {
        btnMais.addEventListener('click', (e) => {
            e.preventDefault();

            const produtoSelecionado = produtosDaAPI.find(p => p.id == selectProduto.value);
            const qtd = parseInt(quantidadeInput.value) || 0;

            if (!produtoSelecionado || qtd <= 0) {
                alert("Selecione um produto válido e defina a quantidade!");
                return;
            }

            const precoUnitario = produtoSelecionado.preco || 0;
            const totalItemMultiplicado = precoUnitario * qtd; 

            // Armazena todas as propriedades necessárias (incluindo IDs e valores unitários para o banco)
            produtosAdicionadosNoPedido.push({
                produtoId: parseInt(produtoSelecionado.id),
                nome: produtoSelecionado.nomeProduto,
                quantidade: qtd,
                valorUnitario: precoUnitario,
                total: totalItemMultiplicado
            });

    
            atualizarListaNaTela();

            selectProduto.value = "";
            quantidadeInput.value = "";
            valorInput.value = "";
        });
    }

    function atualizarListaNaTela() {
        if (!boxLista) return;

        boxLista.innerHTML = "";
        valorTotalGeralDoPedido = 0;

        const listaContainer = document.createElement('div');
        listaContainer.style.display = "flex";
        listaContainer.style.flexDirection = "column";
        listaContainer.style.gap = "10px";
        listaContainer.style.width = "100%";
        listaContainer.style.paddingBottom = "15px";

        produtosAdicionadosNoPedido.forEach(item => {
            valorTotalGeralDoPedido += item.total;

            const linhaProduto = document.createElement('div');
            linhaProduto.style.display = "flex";
            linhaProduto.style.justifyContent = "space-between";
            linhaProduto.style.color = "#ffffff";
            linhaProduto.style.fontSize = "16px";
            linhaProduto.style.width = "100%";
            
            linhaProduto.innerHTML = `
                <span>${item.nome} (x${item.quantidade})</span>
                <span>R$ ${item.total.toFixed(2).replace('.', ',')}</span>
            `;
            
            listaContainer.appendChild(linhaProduto);
        });

        boxLista.appendChild(listaContainer);

        if (precoFinalTexto) {
            precoFinalTexto.textContent = `R$ ${valorTotalGeralDoPedido.toFixed(2).replace('.', ',')}`;
        }
    }
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const clienteId = parseInt(clienteIdInput.value);

            if (!clienteId) {
                alert("Por favor, preencha o campo ID Cliente!");
                return;
            }

            if (produtosAdicionadosNoPedido.length === 0) {
                alert("Adicione pelo menos um produto ao pedido antes de salvar!");
                return;
            }

            const pedidoFinal = {
                status: statusSelect.value,
                total: valorTotalGeralDoPedido, // Enviado como número puro para a API
                clientId: clienteId,
                itens: produtosAdicionadosNoPedido.map(item => ({
                    produtoId: item.produtoId,
                    pedidoId: 0,
                    quantidade: item.quantidade,
                    valorUnitario: item.valorUnitario
                }))
            };

            console.log("Objeto estruturado para envio à API:", pedidoFinal);
            

            alert("Pedido Salvo com Sucesso!");
            produtosAdicionadosNoPedido = [];
            window.location.reload();
        });
    }
            const pedidoFinal = {
                status: statusSelect.value,
                total: valorTotalGeralDoPedido,
                clientId: clienteId,
                itens: produtosAdicionadosNoPedido.map(item => ({
                    produtoId: item.produtoId,
                    pedidoId: 0, 
                    quantidade: item.quantidade,
                    valorUnitario: item.valorUnitario
                }))
            };

            console.log("Objeto estruturado para envio à API:", pedidoFinal);
            
            alert("Pedido Salvo com Sucesso!");
            produtosAdicionadosNoPedido = [];
            window.location.reload();
        });
    }
});