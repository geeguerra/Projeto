// CONFIGURAÇÕES GLOBAIS

const api = 'https://localhost:7093/api/FolhaPagamento';

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
    const txtDescricao = document.getElementById("descricao").value.trim();
    const txtValor = parseFloat(document.getElementById("valor").value);
    const txtDataPagamento = document.getElementById("dataPagamento").value;
    const txtDataVencimento = document.getElementById("dataVencimento").value;

    if (!txtDescricao || isNaN(txtValor) || !txtDataVencimento) {
        alert("Por favor, preencha os campos obrigatórios: Descrição, Valor e Vencimento.");
        return;
    }

    // Montando o objeto limpo para o C#
    const financeiro = {
        Id: 0, 
        Descricao: txtDescricao,
        Valor: txtValor,
        // Se não houver data de pagamento, enviamos a de vencimento para evitar erro 500 de conversão no banco
        DataPagamento: txtDataPagamento ? txtDataPagamento : txtDataVencimento, 
        DataVencimento: txtDataVencimento,
        
        // 🌟 MUDANÇA AQUI: Testando o valor '1' que costuma ser o primeiro item ativo de enums no C# (ex: TipoConta.Pagar = 1)
        Tipo: 1 
    };

    try {
        const resposta = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(financeiro)
        });

        if (!resposta.ok) {
            const detalheErro = await resposta.text();
            console.error("Erro detalhado do servidor:", detalheErro);
            throw new Error("Falha no servidor. Status: " + resposta.status);
        }

        alert("Pagamento cadastrado com sucesso!");

        // Limpa os inputs
        document.getElementById("descricao").value = "";
        document.getElementById("valor").value = "";
        document.getElementById("dataPagamento").value = "";
        document.getElementById("dataVencimento").value = "";

        getFinanceiro();

    } catch (erro) {
        console.error("Erro no processo de cadastro:", erro);
        alert("Erro interno no servidor C# (Erro 500). Olhe o console ou o seu Visual Studio para ver a exceção exata.");
    }
}