const listaProdutos = document.getElementById("listaProdutos");

async function carregarProdutos() {
    try {
        const response = await fetch(" http://localhost:5104/api/Produtos");

        if (!response.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos = await response.json();
        listaProdutos.innerHTML = "";
        if (produtos.length === 0) {
            listaProdutos.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center;">Nenhum produto cadastrado.</td>
                </tr>
            `;
            return;
        }

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
        
        listaProdutos.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: red;">
                    Erro ao carregar produtos.
                </td>
            </tr>
        `;
    }
}
document.getElementById("btnEstoque").addEventListener("click", carregarProdutos);
carregarProdutos();