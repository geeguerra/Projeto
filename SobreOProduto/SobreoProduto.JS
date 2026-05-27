const apiUrl = "https://localhost:7093/api/Produtos/";

// Selecionando os elementos
const codigoElemento = document.querySelectorAll(".info-valor")[0];
const descricaoElemento = document.querySelectorAll(".info-valor")[1];
const precoElemento = document.querySelectorAll(".info-valor")[2];
const estoqueElemento = document.querySelectorAll(".info-valor")[3];
const valorTotalElemento = document.querySelectorAll(".info-valor")[4];

async function carregarProduto() {
    try {
        const response = await fetch(apiUrl);
        const dados = await response.json();

        console.log("Dados recebidos da API:", dados);

        // AJUSTE AQUI: Se a API retorna uma lista, pegamos o primeiro [0]
        // Se ela retornar o objeto direto, use apenas: const produto = dados;
        const produto = Array.isArray(dados) ? dados[0] : dados;

        if (produto) {
            // Preenchendo os campos com os nomes exatos das propriedades da sua API
            codigoElemento.textContent = produto.codigo || "Não informado";
            descricaoElemento.textContent = produto.descricao || "Sem descrição";

            // Formatando o preço corretamente (usando Number() para garantir que é número)
            const precoNum = Number(produto.preco);
            const qtdNum = Number(produto.qtdEstoque);

            precoElemento.textContent = precoNum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            estoqueElemento.textContent = `${qtdNum} unidades`;

            // Cálculo do Total com segurança para não gerar NaN
            if (!isNaN(precoNum) && !isNaN(qtdNum)) {
                const total = precoNum * qtdNum;
                valorTotalElemento.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            } else {
                valorTotalElemento.textContent = "Erro no cálculo";
            }
        }

    } catch (error) {
        console.error("Erro detalhado:", error);
        alert("Erro ao conectar com a API. Verifique se o servidor backend está rodando.");
    }
}

carregarProduto();