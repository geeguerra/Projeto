// CONFIGURAÇÕES GLOBAIS
const api = ' http://localhost:5104/api/Pagamento';
const apiFuncionarios = ' http://localhost:5104/api/Funcionario'; 

const tabela = document.querySelector("tbody");

async function carregarFuncionariosSelect() {
    const selectFuncionario = document.querySelector("#funcionario");
    
    if (!selectFuncionario) return; 

    try {
        const resposta = await fetch(apiFuncionarios);
        const funcionarios = await resposta.json();

        selectFuncionario.innerHTML = '<option selected disabled value="">Selecione o Funcionário</option>';

        funcionarios.forEach(funcionario => {
            const opcao = document.createElement("option");
            opcao.value = funcionario.id; 
            opcao.textContent = funcionario.nome; 
            
            selectFuncionario.appendChild(opcao);
        });
    } catch (erro) {
        console.log("Erro ao carregar select de funcionários:", erro);
    }
}

function calcularFolha() {
    const selectFunc = document.querySelector("#funcionario");
    const nomeFuncionario = selectFunc.options[selectFunc.selectedIndex]?.text;

    if (!selectFunc.value) {
        alert("Por favor, selecione um funcionário antes de calcular.");
        return;
    }
    const salarioBase = Number(document.querySelector("#salarioBase").value) || 0;
    const horasExtras = Number(document.querySelector("#horasExtras").value) || 0;
    const valorHoraExtra = Number(document.querySelector("#valorHoraExtra").value) || 0;
    
    const pctBeneficios = Number(document.querySelector("#descontoBeneficios").value) || 0;
    const pctInss = Number(document.querySelector("#descontoInss").value) || 0;
    const pctOutros = Number(document.querySelector("#descontoOutros").value) || 0;

    const totalHorasExtras = horasExtras * valorHoraExtra;

    const valorDescontoBeneficios = salarioBase * (pctBeneficios / 100);
    const valorDescontoInss = salarioBase * (pctInss / 100);
    const valorDescontoOutros = salarioBase * (pctOutros / 100);
    
    const totalDescontos = valorDescontoBeneficios + valorDescontoInss + valorDescontoOutros;
    const salarioFinal = (salarioBase + totalHorasExtras) - totalDescontos;

    document.querySelector("#resFuncionario").textContent = nomeFuncionario;
    document.querySelector("#resValHoraExtra").textContent = totalHorasExtras.toFixed(2);
    
    document.querySelector("#resValBeneficios").textContent = valorDescontoBeneficios.toFixed(2);
    document.querySelector("#resValInss").textContent = valorDescontoInss.toFixed(2);
    document.querySelector("#resValOutros").textContent = valorDescontoOutros.toFixed(2);
    
    document.querySelector("#resSalarioTotal").value = `R$ ${salarioFinal.toFixed(2)}`;
}

async function getPagamentos() {
    if (!tabela) return; // Evita quebrar o código se a tabela não existir nessa tela
    try {
        const resposta = await fetch(api);
        const pagamentos = await resposta.json();
        
        tabela.innerHTML = "";

        pagamentos.forEach(pagamento => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${pagamento.descricao}</td>
                <td>R$ ${Number(pagamento.valor).toFixed(2)}</td>
                <td>${new Date(pagamento.dataVencimento).toLocaleDateString('pt-BR')}</td>
                <td>${new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button onclick="editarPagamento(${pagamento.id})">Editar</button>
                </td>
                <td>
                    <button onclick="deletarPagamento(${pagamento.id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (erro) {
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
    } catch (erro) {
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

        alert("Pagamento updated!");
        getPagamentos();
    } catch (erro) {
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
    } catch (erro) {
        console.log("Erro ao excluir:", erro);
    }
}
const botaoPagamento = document.querySelector("#btnPagamento");
if (botaoPagamento) {
    botaoPagamento.addEventListener("click", () => {
        cadastrarPagamento();
    });
}

const botaoCalcular = document.querySelector("#btnCalcular");
if (botaoCalcular) {
    botaoCalcular.addEventListener("click", () => {
        calcularFolha();
    });
}

getPagamentos();
carregarFuncionariosSelect();