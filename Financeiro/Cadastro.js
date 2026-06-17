const api = ' http://localhost:5104/api/Financeiro';
const tabela = document.querySelector("tbody");


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

async function cadastrarFinanceiro() {

    const financeiro = {

    descricao: document.getElementById("descricao").value,

    valor: Number(document.getElementById("valor").value),

    dataPagamento: document.getElementById("dataPagamento").value,

    dataVencimento: document.getElementById("dataVencimento").value
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


const botao = document.querySelector("#botaoPagamento");

botao.addEventListener("click", () => {

    cadastrarFinanceiro();

});

getFinanceiro();