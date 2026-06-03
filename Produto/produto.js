// ======================================
// CONFIGURAÇÕES GLOBAIS
// ======================================

const api = "http://localhost:5146/api/Produtos";

const tabela = document.querySelector("tbody");


// ======================================
// GET ALL
// LISTAR TODOS OS PRODUTOS
// ======================================

async function getProdutos() {

    try {

        const resposta = await fetch(api);

        const produtos = await resposta.json();

        tabela.innerHTML = "";

        produtos.forEach(produto => {

            let status = "";
            let classe = "";

            // STATUS ESTOQUE
            if (produto.quantidadeEstoque <= 5) {

                status = "Baixa Quantidade";
                classe = "vermelho";

            }

            else if (produto.quantidadeEstoque <= 15) {

                status = "Média Quantidade";
                classe = "amarelo";

            }

            else {

                status = "Qtd Estoque";
                classe = "verde";

            }


            // CRIAR LINHA
            const linha = document.createElement("tr");

            linha.innerHTML = `

                <td>
                    <div class="imgbloco"></div>
                </td>

                <td>
                    ${produto.nomeProduto}
                </td>

                <td>
                    ${produto.codigo}
                </td>

                <td class="${classe}">
                    ${status}
                </td>

                <td>
                    R$ ${produto.preco.toFixed(2)}
                </td>

                <td>
                    <button onclick="getProdutoById(${produto.id})">
                        Detalhes
                    </button>
                </td>

                <td>
                    <button onclick="editarProduto(${produto.id})">
                        Editar
                    </button>
                </td>

                <td>
                    <button onclick="deletarProduto(${produto.id})">
                        Excluir
                    </button>
                </td>

            `;

            tabela.appendChild(linha);

        });

    }

    catch (erro) {

        console.log("Erro ao listar produtos:", erro);

    }
}


// ======================================
// GET BY ID
// LISTAR PRODUTO POR ID
// ======================================

async function getProdutoById(id) {

    try {

        const resposta = await fetch(`${api}/${id}`);

        const produto = await resposta.json();

        alert(
            `Produto: ${produto.nomeProduto}
Código: ${produto.codigo}
Quantidade: ${produto.quantidadeEstoque}
Preço: R$ ${produto.preco}`
        );

    }

    catch (erro) {

        console.log("Erro ao buscar produto:", erro);

    }
}


// ======================================
// POST
// CADASTRAR PRODUTO
// ======================================

async function cadastrarProduto() {

    const produto = {

        nomeProduto: "Notebook Gamer",

        codigo: 100,

        quantidadeEstoque: 20,

        preco: 3500
    };

    try {

        await fetch(api, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(produto)

        });

        alert("Produto cadastrado!");

        getProdutos();

    }

    catch (erro) {

        console.log("Erro ao cadastrar:", erro);

    }
}


// ======================================
// PUT
// EDITAR PRODUTO
// ======================================

async function editarProduto(id) {

    const produtoAtualizado = {

        nomeProduto: "Produto Atualizado",

        codigo: 999,

        quantidadeEstoque: 50,

        preco: 4500
    };

    try {

        await fetch(`${api}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(produtoAtualizado)

        });

        alert("Produto atualizado!");

        getProdutos();

    }

    catch (erro) {

        console.log("Erro ao atualizar:", erro);

    }
}


// ======================================
// DELETE
// EXCLUIR PRODUTO
// ======================================

async function deletarProduto(id) {

    const confirmar = confirm("Deseja excluir esse produto?");

    if (!confirmar) return;

    try {

        await fetch(`${api}/${id}`, {

            method: "DELETE"

        });

        alert("Produto excluído!");

        getProdutos();

    }

    catch (erro) {

        console.log("Erro ao excluir:", erro);

    }
}


// ======================================
// BOTÃO ESTOQUE
// ======================================

const botao = document.querySelector("#btnEstoque");

botao.addEventListener("click", () => {

    cadastrarProduto();

});


// ======================================
// INICIAR SISTEMA
// ======================================

getProdutos();