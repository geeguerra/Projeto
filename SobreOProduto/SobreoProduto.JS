const apiUrl = "https://localhost:7093/api/Produtos/";

const container = document.getElementById("produtos-container");

async function carregarProdutos() {
    try {

        const response = await fetch(apiUrl);
        const produtos = await response.json();

        container.innerHTML = "";

        produtos.forEach(produto => {

            const precoNum = Number(produto.preco);
            const qtdNum = Number(produto.quantidadeEstoque);

            const total = precoNum * qtdNum;

            const card = `
            
                <section class="card-produto">

                    <h2 class="card-titulo">${produto.nomeProduto}</h2>

                    <div class="info-linha">
                        <span class="info-titulo">Código:</span>
                        <span class="info-valor">${produto.codigo}</span>
                    </div>

                    <div class="info-linha">
                        <span class="info-titulo">Preço unitário:</span>
                        <span class="info-valor">
                            ${precoNum.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                        </span>
                    </div>

                    <div class="info-linha">
                        <span class="info-titulo">Qtd Estoque:</span>
                        <span class="info-valor estoque-destaque">
                            ${qtdNum} unidades
                        </span>
                    </div>

                    <div class="info-linha">
                        <span class="info-titulo">Valor total:</span>
                        <span class="info-valor">
                            ${total.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                        </span>
                    </div>

                    <div class="actions-area">
                        <button 
                            class="BtnDetalhesProduto"
                            onclick="excluirProduto(${produto.id})">
                            Excluir
                        </button>
                    </div>

                </section>
            `;

            container.innerHTML += card;
        });

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar produtos");
    }
}

async function excluirProduto(id) {

    const confirmar = confirm("Deseja realmente excluir este produto?");

    if (!confirmar) return;

    try {

        const response = await fetch(
            `https://localhost:7093/api/Produtos/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao excluir produto");
        }

        alert("Produto excluído com sucesso!");

        carregarProdutos();

    } catch (error) {

        console.error(error);
        alert("Erro ao excluir produto");

    }
}

carregarProdutos();