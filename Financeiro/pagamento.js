

const api = 'http://localhost:7093/api/Pagamento';

const tabela = document.querySelector("tbody");


async function getPagamentos() {

    try {

        const resposta = await fetch(api);

        const pagamentos = await resposta.json();

        tabela.innerHTML = "";

        pagamentos.forEach(pagamento => {

            const linha = document.createElement("tr");

            linha.innerHTML = `
            

                <td>
                
                    ${pagamento.descricao}

                </td>

                <td>
                    R$ ${Number(pagamento.valor).toFixed(2)}
                </td>

                <td>
                    ${new Date(pagamento.dataVencimento).toLocaleDateString('pt-BR')}
                    
                </td>

                <td>
                    ${new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')}
                </td>

                <td>
                    <button onclick="editarPagamento(${pagamento.id})">
                        Editar
                    </button>
                </td>

                <td>
                    <button onclick="deletarPagamento(${pagamento.id})">
                        Excluir
                    </button>
                </td>

            `;

            tabela.appendChild(linha);

        });

    }

    catch (erro) {

        console.log("Erro ao listar pagamentos:", erro);

    }
}


async function cadastrarPagamento() {

    const pagamento = {

        dataVencimento: "2026-06-30",

        valor: 500.00,

        descricao: "Pagamento de fornecedor",

        dataPagamento: "2026-06-20"
    };

    try {

        await fetch(api, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pagamento)

        });

        alert("Pagamento cadastrado!");

        getPagamentos();

    }

    catch (erro) {

        console.log("Erro ao cadastrar:", erro);

    }
}


async function editarPagamento(id) {

    const pagamentoAtualizado = {

        id: id,

        dataVencimento: "2026-07-15",

        valor: 800.00,

        descricao: "Pagamento atualizado",

        dataPagamento: "2026-07-10"
    };

    try {

        await fetch(api, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pagamentoAtualizado)

        });

        alert("Pagamento atualizado!");

        getPagamentos();

    }

    catch (erro) {

        console.log("Erro ao atualizar:", erro);

    }
}


async function deletarPagamento(id) {

    const confirmar = confirm("Deseja excluir este pagamento?");

    if (!confirmar) return;

    try {

        await fetch(`${api}/${id}`, {

            method: "DELETE"

        });

        alert("Pagamento excluído!");

        getPagamentos();

    }

    catch (erro) {

        console.log("Erro ao excluir:", erro);

    }
}


const botao = document.querySelector("#btnPagamento");

botao.addEventListener("click", () => {

    cadastrarPagamento();

});

getPagamentos();