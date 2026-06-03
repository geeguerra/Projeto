// CONFIGURAÇÕES GLOBAIS

const api = 'http://localhost:7093/api/Financeiro';

const tabela = document.querySelector("tbody");


// GET ALL
// LISTAR TODOS OS REGISTROS


async function getFinanceiro() {

    try {

        const resposta = await fetch(api);

        const financeiros = await resposta.json();

        tabela.innerHTML = "";

        financeiros.forEach(financeiro => {

            const linha = document.createElement("tr");

            linha.innerHTML = `

                <td>
                    ${financeiro.descricao}
                </td>

                <td>
                    R$ ${Number(financeiro.valor).toFixed(2)}
                </td>

                <td>
                    ${new Date(financeiro.dataPagamento).toLocaleDateString('pt-BR')}
                </td>

                <td>
                    ${new Date(financeiro.dataVencimento).toLocaleDateString('pt-BR')}
                </td>

                <td>
                    <button onclick="getFinanceiroById(${financeiro.id})">
                        Detalhes
                    </button>
                </td>

                <td>
                    <button onclick="editarFinanceiro(${financeiro.id})">
                        Editar
                    </button>
                </td>

                <td>
                    <button onclick="deletarFinanceiro(${financeiro.id})">
                        Excluir
                    </button>
                </td>

            `;

            tabela.appendChild(linha);

        });

    }

    catch (erro) {

        console.log("Erro ao listar financeiro:", erro);

    }
}


// GET BY ID
// LISTAR REGISTRO POR ID


async function getFinanceiroById(id) {

    try {

        const resposta = await fetch(`${api}/${id}`);

        const financeiro = await resposta.json();

        alert(
            `Descrição: ${financeiro.descricao}
    Valor: R$ ${financeiro.valor}
    Data Pagamento: ${new Date(financeiro.dataPagamento).toLocaleDateString('pt-BR')}
    Data Vencimento: ${new Date(financeiro.dataVencimento).toLocaleDateString('pt-BR')}`
        );

    }

    catch (erro) {

        console.log("Erro ao buscar registro:", erro);

    }
}

// POST
// CADASTRAR REGISTRO

async function cadastrarFinanceiro() {

    const financeiro = {

        descricao: "Conta de Energia",

        valor: 250.90,

        dataPagamento: "2026-05-22",

        dataVencimento: "2026-06-10"
    };

    try {

        await fetch(api, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(financeiro)

        });

        alert("Registro financeiro cadastrado!");

        getFinanceiro();

    }

    catch (erro) {

        console.log("Erro ao cadastrar:", erro);

    }
}

// PUT
// EDITAR REGISTRO


async function editarFinanceiro(id) {

    const financeiroAtualizado = {

        descricao: "Conta Atualizada",

        valor: 500.00,

        dataPagamento: "2026-05-25",

        dataVencimento: "2026-06-15"
    };

    try {

        await fetch(`${api}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(financeiroAtualizado)

        });

        alert("Registro atualizado!");

        getFinanceiro();

    }

    catch (erro) {

        console.log("Erro ao atualizar:", erro);

    }
}


// DELETE
// EXCLUIR REGISTRO

async function deletarFinanceiro(id) {

    const confirmar = confirm("Deseja excluir esse registro?");

    if (!confirmar) return;

    try {

        await fetch(`${api}/${id}`, {

            method: "DELETE"

        });

        alert("Registro excluído!");

        getFinanceiro();

    }

    catch (erro) {

        console.log("Erro ao excluir:", erro);

    }
}

// BOTÃO FINANCEIRO


const botao = document.querySelector("#botãoPagamento");

botao.addEventListener("click", () => {

    cadastrarFinanceiro();

});

// INICIAR SISTEMA


getFinanceiro();