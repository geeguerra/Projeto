// CONFIGURAÇÕES GLOBAIS
const api = 'http://localhost:7093/api/Pagamento';
const apiFuncionarios = 'https://localhost:7093/api/Funcionario'; 

// Note que na sua folha de pagamento atual não há uma tabela <tbody>, 
// mas mantive a linha abaixo para evitar erros caso use o mesmo script em outra tela.
const tabela = document.querySelector("tbody");


// ==========================================
// FUNÇÃO: CARREGAR FUNCIONÁRIOS NO SELECT
// ==========================================
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


// ==========================================
// 🚀 NOVA FUNÇÃO: CALCULAR FOLHA DE PAGAMENTO
// ==========================================
function calcularFolha() {
    // 1. Pega o funcionário selecionado no <select>
    const selectFunc = document.querySelector("#funcionario");
    const nomeFuncionario = selectFunc.options[selectFunc.selectedIndex]?.text;

    // Validação básica caso o usuário clique em calcular sem escolher ninguém
    if (!selectFunc.value) {
        alert("Por favor, selecione um funcionário antes de calcular.");
        return;
    }

    // 2. Captura os valores dos inputs (se estiver vazio, vira 0 automaticamente)
    const salarioBase = Number(document.querySelector("#salarioBase").value) || 0;
    const horasExtras = Number(document.querySelector("#horasExtras").value) || 0;
    const valorHoraExtra = Number(document.querySelector("#valorHoraExtra").value) || 0;
    
    // Porcentagens de desconto
    const pctBeneficios = Number(document.querySelector("#descontoBeneficios").value) || 0;
    const pctInss = Number(document.querySelector("#descontoInss").value) || 0;
    const pctOutros = Number(document.querySelector("#descontoOutros").value) || 0;

    // 3. PROCESSAMENTO MATEMÁTICO
    const totalHorasExtras = horasExtras * valorHoraExtra;
    
    // Cálculo dos descontos em cima do Salário Base
    const valorDescontoBeneficios = salarioBase * (pctBeneficios / 100);
    const valorDescontoInss = salarioBase * (pctInss / 100);
    const valorDescontoOutros = salarioBase * (pctOutros / 100);
    
    const totalDescontos = valorDescontoBeneficios + valorDescontoInss + valorDescontoOutros;

    // Fórmula do Salário Final
    const salarioFinal = (salarioBase + totalHorasExtras) - totalDescontos;

    // 4. ATUALIZA OS RESULTADOS NA TELA (Lado Direito)
    document.querySelector("#resFuncionario").textContent = nomeFuncionario;
    document.querySelector("#resValHoraExtra").textContent = totalHorasExtras.toFixed(2);
    
    document.querySelector("#resValBeneficios").textContent = valorDescontoBeneficios.toFixed(2);
    document.querySelector("#resValInss").textContent = valorDescontoInss.toFixed(2);
    document.querySelector("#resValOutros").textContent = valorDescontoOutros.toFixed(2);
    
    // Altera o valor dentro do input final de Salário Total
    document.querySelector("#resSalarioTotal").value = `R$ ${salarioFinal.toFixed(2)}`;
}


// ==========================================
// FUNÇÕES DA API (PAGAMENTO)
// ==========================================
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


// ==========================================
// EVENT LISTENERS (OUVIDORES DOS BOTÕES)
// ==========================================

// Esse escuta o botão antigo caso ele exista
const botaoPagamento = document.querySelector("#btnPagamento");
if (botaoPagamento) {
    botaoPagamento.addEventListener("click", () => {
        cadastrarPagamento();
    });
}

// 🎯 Esse escuta o botão de Calcular que colocamos no HTML modificado
const botaoCalcular = document.querySelector("#btnCalcular");
if (botaoCalcular) {
    botaoCalcular.addEventListener("click", () => {
        calcularFolha();
    });
}


// INICIALIZADORES DO SISTEMA
getPagamentos();
carregarFuncionariosSelect();