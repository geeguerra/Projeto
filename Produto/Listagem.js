const listaProdutos = document.getElementById("listaProdutos");

async function carregarProdutos() {
    try {
        const response = await fetch("https://localhost:7093/api/Produtos");

        if (!response.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos = await response.json();

        // Limpa a tabela antes de renderizar
        listaProdutos.innerHTML = "";

        // Se não houver produtos, renderiza a mensagem ocupando as 4 colunas
        if (produtos.length === 0) {
            listaProdutos.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center;">Nenhum produto cadastrado.</td>
                </tr>
            `;
            return;
        }

        // Renderiza as linhas com 4 colunas bem alinhadas
        produtos.forEach(produto => {
            listaProdutos.innerHTML += `
                <tr>
                    <td>${produto.nomeProduto}</td>
                    <td>${produto.codigo}</td>
                    <td style="text-align: center;">${produto.quantidadeEstoque}</td>
                    <td style="text-align: right;">
                        R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error(erro);
        
        // Mensagem de erro também ajustada para 4 colunas
        listaProdutos.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: red;">
                    Erro ao carregar produtos.
                </td>
            </tr>
        `;
    }
}

// Eventos
document.getElementById("btnEstoque").addEventListener("click", carregarProdutos);
carregarProdutos();