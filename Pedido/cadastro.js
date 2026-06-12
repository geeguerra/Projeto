<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    // 1. URLs das suas APIs do C#
    const URL_API_PRODUTOS = 'https://localhost:7093/api/Produtos';
    const URL_API_VENDA = 'https://localhost:7093/api/Venda';

    // 2. Elementos do seu HTML original mapeados por ordem de aparição
    const form = document.querySelector('.order-form');
    const btnAdd = document.querySelector('.btn-add');
    const resumoPedido = document.querySelector('.order-summary');
    const totalTexto = document.querySelector('.total-text strong');
    
    // Segunda linha do formulário: [0] é o select do Status, [1] é o select do Produto
    const selectProduto = document.querySelectorAll('select')[1]; 
    // Inputs numéricos: [0] é o Valor (superior), [1] é a Quantidade
    const inputValorVenda = document.querySelectorAll('input[type="number"]')[0];
    const inputQuantidade = document.querySelectorAll('input[type="number"]')[1];
    const inputData = document.querySelector('input[type="date"]');
    const selectStatus = document.querySelectorAll('select')[0];

    let total = 0;
    let mapaPrecosProdutos = {}; // Dicionário temporário para guardar os preços vindos da API

    // ==========================================================================
    // FUNÇÃO: Busca os produtos na API e preenche as options dinamicamente
    // ==========================================================================
    async function carregarProdutosDoSite() {
        if (!selectProduto) return;

        try {
            const response = await fetch(URL_API_PRODUTOS);
            
            if (response.ok) {
                const produtos = await response.json();
                
                // Limpa mantendo o texto "Selecionar" original que você colocou
                selectProduto.innerHTML = '<option>Selecionar</option>';

                // Alimenta o select com o que está cadastrado no banco de dados
                produtos.forEach(produto => {
                    const option = document.createElement('option');
                    option.value = produto.nomeProduto;    // Valor de envio (ex: 'Copo')
                    option.textContent = produto.nomeProduto;  // Texto exibido na tela
                    
                    // Salva o preço mapeado pelo nome do produto
                    mapaPrecosProdutos[produto.nomeProduto] = produto.preco;

                    selectProduto.appendChild(option);
                });
                console.log('Options de produtos atualizadas com sucesso direto da API!');
            } else {
                console.error('A API de produtos retornou status de erro:', response.status);
            }
        } catch (error) {
            console.error('Erro de conexão ao buscar produtos para o select:', error);
        }
    }

    // Monitora quando o usuário escolhe um produto para preencher o campo "Valor" automaticamente
    selectProduto?.addEventListener('change', () => {
        const produtoSelecionado = selectProduto.value;
        const precoEncontrado = mapaPrecosProdutos[produtoSelecionado];

        if (precoEncontrado !== undefined && inputValorVenda) {
            inputValorVenda.value = precoEncontrado;
        }
    });

    // ==========================================================================
    // LÓGICA DO BOTÃO "+" (Adicionar item ao bloco visual de resumo)
    // ==========================================================================
    btnAdd?.addEventListener("click", () => {
        const produto = selectProduto.value;
        const quantidade = parseInt(inputQuantidade.value) || 0;

        if (produto === "Selecionar" || produto === "" || quantidade <= 0) {
            alert("Por favor, selecione um produto válido e defina a quantidade.");
            return;
        }

        // Pega o preço dinâmico do mapa ou aceita o que estiver digitado no campo valor
        const precoItem = mapaPrecosProdutos[produto] || parseFloat(inputValorVenda.value) || 0;
        const subtotal = quantidade * precoItem;
        total += subtotal;

        // Cria o elemento visual respeitando rigorosamente seu layout antigo
        const novoItem = document.createElement("div");
        novoItem.classList.add("summary-item");
        novoItem.innerHTML = `
            <span>${produto} x${quantidade}</span>
            <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        `;

        // Insere a nova linha logo acima do bloco separador (summary-footer)
        resumoPedido.insertBefore(novoItem, document.querySelector(".summary-footer"));

        // Atualiza a soma total na tela dentro do seu strong
        totalTexto.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

        // Reseta apenas o campo de quantidade para nova inserção
        inputQuantidade.value = "";
    });

    // ==========================================================================
    // LÓGICA DO SUBMIT (Salvar a Venda na API /api/Venda)
    // ==========================================================================
    form?.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede que a página recarregue

        if (total === 0) {
            alert("Adicione pelo menos um produto usando o botão '+' antes de salvar.");
            return;
        }

        // Pega o nome do primeiro produto adicionado na lista visual para registrar no banco
        const primeiroItemLista = document.querySelector('.order-summary .summary-item span');
        let nomeProdutoFinal = selectProduto.value;
        let quantidadeFinal = parseInt(inputQuantidade.value) || 1;

        if (primeiroItemLista) {
            nomeProdutoFinal = primeiroItemLista.innerText.split(' x')[0];
            quantidadeFinal = parseInt(primeiroItemLista.innerText.split(' x')[1]) || 1;
        }

        // Monta o objeto JSON ajustado para o banco
        const dadosVenda = {
            data: inputData?.value || new Date().toISOString().split('T')[0],
            status: selectStatus?.value || "Em andamento",
            nomeProduto: nomeProdutoFinal,
            quantidade: quantidadeFinal,
            valorTotal: total
        };

        try {
            const response = await fetch(URL_API_VENDA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosVenda)
            });

            if (response.ok) {
                alert("Pedido gravado com sucesso no banco de dados!");
                
                // Reseta os campos e valores acumulados (Seu comportamento original)
                form.reset();
                total = 0;
                totalTexto.innerText = "R$ 0,00";
                
                // Remove as linhas temporárias criadas pelo botão "+"
                document.querySelectorAll('.order-summary .summary-item').forEach(item => item.remove());
            } else {
                alert(`Erro ${response.status}: A API recusou o salvamento do pedido.`);
            }
        } catch (error) {
            console.error("Erro na comunicação com a rota de Vendas:", error);
            alert("Não foi possível estabelecer contato com o servidor backend.");
        }
    });

    // Executa a carga dos dados assim que o arquivo é lido pelo navegador
    carregarProdutosDoSite();
=======
const form = document.querySelector(".order-form");

const btnAdd = document.querySelector(".btn-add");

const produtoSelect = document.querySelector(".input-with-btn select");

const quantidadeInput = document.querySelector(".quantidade");

const resumoPedido = document.querySelector(".order-summary");

const totalTexto = document.querySelector(".total-text strong");

let total = 0;


btnAdd.addEventListener("click", () => {

    const produto = produtoSelect.value;

    const quantidade = quantidadeInput.value;

    if (produto === "Selecionar" || quantidade === "") {

        alert("Selecione um produto e a quantidade!");
        return;
    }

    const valorProduto = 10;

    const subtotal = valorProduto * quantidade;

    total += subtotal;

    const novoItem = document.createElement("div");

    novoItem.classList.add("summary-item");

    novoItem.innerHTML = `
    
        <span>${produto} x${quantidade}</span>
        <span>R$ ${subtotal.toFixed(2)}</span>

    `;

    resumoPedido.insertBefore(
        novoItem,
        document.querySelector(".summary-footer")
    );

    totalTexto.innerText = `R$ ${total.toFixed(2)}`;

    quantidadeInput.value = "";
});


form.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Pedido salvo com sucesso!");

    form.reset();

    total = 0;

    totalTexto.innerText = "R$ 0,00";

>>>>>>> f259d3d3464e484f9bc48909a74ea2f0615dcd23
});