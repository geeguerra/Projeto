const BASE_URL = "https://localhost:7093/api/Estoque";

let movimentacaoEditandoId = null;

async function apiFetch(endpoint = "", method = "GET", data = null) {

    const config = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {

        const erro = await response.text();

        throw new Error(erro);
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json().catch(() => null);
}

async function carregarProdutos() {

    try {

        const response =
            await fetch("https://localhost:7093/api/Produtos");

        const produtos = await response.json();

        const select = document.getElementById("produto");

        select.innerHTML = `
            <option selected disabled value="">
                Produtos
            </option>
        `;

        produtos.forEach(produto => {

            select.innerHTML += `
                <option value="${produto.id}">
                    ${produto.nomeProduto}
                </option>
            `;
        });

    } catch (erro) {

        console.log(erro);

        alert("Erro ao carregar produtos");
    }
}

async function carregarTabela() {

    try {

        const dados = await apiFetch();

        const tbody = document.getElementById("tbodyEstoque");

        tbody.innerHTML = "";

        dados.forEach(mov => {

            let classeQuantidade = "verde";

            if (mov.quantidade <= 5) {

                classeQuantidade = "vermelho";
            }

            else if (mov.quantidade <= 10) {

                classeQuantidade = "amarelo";
            }

            tbody.innerHTML += `
                <tr>

                    <td>${mov.nomeProduto}</td>

                    <td>${mov.tipo}</td>

                    <td class="${classeQuantidade}">
                        ${mov.quantidade}
                    </td>

                    <td>
                        ${new Date(mov.data)
                            .toLocaleDateString("pt-BR")}
                    </td>

                    <td>

                        <a href="#"
                            onclick="editarMov(${mov.id})">
                            Editar
                        </a>

                        |

                        <a href="#"
                            onclick="excluirMov(${mov.id})">
                            Excluir
                        </a>

                    </td>

                </tr>
            `;
        });

    } catch (erro) {

        console.log(erro);

        alert("Erro ao carregar estoque");
    }
}

async function lancarEstoque() {

    const produtoId =
        document.getElementById("produto").value;

    const tipo =
        document.getElementById("tipoMovimentacao").value;

    const quantidade =
        document.getElementById("quantidade").value;

    const data =
        document.getElementById("dataMovimentacao").value;

    if (!produtoId || !tipo || !quantidade || !data) {

        alert("Preencha todos os campos");

        return;
    }

    const payload = {

        produtoId: parseInt(produtoId),

        tipo: tipo,

        quantidade: parseInt(quantidade),

        data: data
    };

    try {

        if (movimentacaoEditandoId == null) {

            await apiFetch("", "POST", payload);

            alert("Movimentação cadastrada!");
        }

        else {

            payload.id = movimentacaoEditandoId;

            await apiFetch(
                `/${movimentacaoEditandoId}`,
                "PUT",
                payload
            );

            alert("Movimentação atualizada!");

            movimentacaoEditandoId = null;
        }

        limparCampos();

        carregarTabela();

    } catch (erro) {

        console.log(erro);

        alert(erro.message);
    }
}

async function editarMov(id) {

    try {

        const dados = await apiFetch();

        const mov = dados.find(x => x.id === id);

        if (!mov) return;

        movimentacaoEditandoId = mov.id;

        document.getElementById("tipoMovimentacao").value =
            mov.tipo;

        document.getElementById("quantidade").value =
            mov.quantidade;

        document.getElementById("dataMovimentacao").value =
            mov.data.split("T")[0];

    } catch (erro) {

        console.log(erro);
    }
}

async function excluirMov(id) {

    const confirmar =
        confirm("Deseja excluir essa movimentação?");

    if (!confirmar) return;

    try {

        await apiFetch(`/${id}`, "DELETE");

        alert("Movimentação excluída!");

        carregarTabela();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao excluir");
    }
}

function limparCampos() {

    document.getElementById("produto").value = "";

    document.getElementById("tipoMovimentacao").value = "";

    document.getElementById("quantidade").value = "";

    document.getElementById("dataMovimentacao").value = "";
}

document.addEventListener("DOMContentLoaded", () => {

    carregarProdutos();

    carregarTabela();

    document
        .getElementById("btnEstoque")
        .addEventListener("click", lancarEstoque);
});