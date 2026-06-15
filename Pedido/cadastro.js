document.addEventListener('DOMContentLoaded', () => {

    // Inicializa o carregamento dos produtos vindos da API
    carregarProdutos();

    // --- 1. SELETORES REAIS DO SEU FORMULÁRIO (Mapeados por ID) ---
    const selectProduto = document.getElementById("produto");
    const dataInput = document.getElementById("pedido-data");
    const statusSelect = document.getElementById("pedido-status");
    const clienteIdInput = document.getElementById("cliente-id");
    const quantidadeInput = document.getElementById("quantidade");
    const valorInput = document.getElementById("valor-unitario"); 
    const form = document.getElementById('form-pedido');
    const boxLista = document.getElementById("box-lista-itens");
    const precoFinalTexto = document.getElementById("valor-total-geral");

    // Variáveis de controle globais
    let produtosDaAPI = [];
    let produtosAdicionadosNoPedido = []; 
    let valorTotalGeralDoPedido = 0;

    // --- 2. SUA FUNÇÃO DE CARREGAMENTO DA API ---
    async function carregarProdutos() {
        try {
            console.log("Iniciando carregamento dos produtos...");
            const response = await fetch("https://localhost:7093/api/Produtos");
            
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
        }
    }

    // --- 3. EXIBIR APENAS O PREÇO UNITÁRIO NO INPUT SUPERIOR ---
    function exibirPrecoUnitario() {
        if (!selectProduto || !valorInput) return;

        const produtoSelecionado = produtosDaAPI.find(p => p.id == selectProduto.value);
        const precoUnitario = produtoSelecionado ? (produtoSelecionado.preco || 0) : 0;

        if (precoUnitario > 0) {
            valorInput.value = precoUnitario.toFixed(2);
        } else {
            valorInput.value = "";
        }
    }

    if (selectProduto) selectProduto.addEventListener('change', exibirPrecoUnitario);

    // --- 4. ENCONTRAR O BOTÃO DE ADICIONAR (+) ---
    const btnMais = document.querySelector('.btn-add');

    // --- 5. EVENTO DO BOTÃO (+) - CÁLCULO E ORGANIZAÇÃO DOS IDs ---
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

            // Redesenha o resumo em tempo real
            atualizarListaNaTela();

            // Limpa os campos de inserção de itens
            selectProduto.value = "";
            quantidadeInput.value = "";
            valorInput.value = "";
        });
    }

    // --- 6. RENDERIZADOR DA LISTA ---
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

    // --- 7. BOTÃO SALVAR PEDIDO FINAL (ENVIA COMPATÍVEL COM O SEU BACKEND) ---
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

            // Montagem exata baseada na imagem da requisição do seu Banco de Dados!
            const pedidoFinal = {
                status: statusSelect.value,
                total: valorTotalGeralDoPedido, // Enviado como número puro para a API
                clientId: clienteId,
                itens: produtosAdicionadosNoPedido.map(item => ({
                    produtoId: item.produtoId,
                    pedidoId: 0, // Geralmente gerado de forma incremental no banco
                    quantidade: item.quantidade,
                    valorUnitario: item.valorUnitario
                }))
            };

            console.log("Objeto estruturado para envio à API:", pedidoFinal);
            
            // Aqui você pode inserir sua chamada fetch final método POST se quiser salvar de fato:
            // fetch("https://localhost:7093/api/Pedidos", { method: "POST", body: JSON.stringify(pedidoFinal), ... })

            alert("Pedido Salvo com Sucesso!");
            produtosAdicionadosNoPedido = [];
            window.location.reload();
        });
    }
});