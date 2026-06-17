// =========================================================================
// CONFIGURAÇÃO: URLs reais da sua API local
// =========================================================================
const URL_CLIENTES = 'https://localhost:7093/api/Cliente'; 
const URL_FORNECECORES = 'https://localhost:7093/api/Fornecedor'; 

// Mude para 'false' para puxar do banco através da API. Deixe 'true' para testes rápidos.
const USAR_DADOS_DE_TESTE = false; 

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosUnificados();
});

async function carregarDadosUnificados() {
    // Seleciona o corpo da tabela pelo ID que adicionamos no HTML
    const corpoTabela = document.getElementById('corpo-tabela');

    if (!corpoTabela) {
        console.error('Erro: Não foi possível encontrar o elemento <tbody id="corpo-tabela"> no HTML.');
        return;
    }

    try {
        let listaFinal = [];

        if (USAR_DADOS_DE_TESTE) {
            console.warn("⚠️ Exibindo dados de teste fictícios.");
            listaFinal = obterDadosFicticios();
        } else {
            // Busca nas duas APIs simultaneamente
            const [resClientes, resFornecedores] = await Promise.all([
                fetch(URL_CLIENTES),
                fetch(URL_FORNECECORES)
            ]);

            if (!resClientes.ok) throw new Error(`Erro nos clientes (${resClientes.status})`);
            if (!resFornecedores.ok) throw new Error(`Erro nos fornecedores (${resFornecedores.status})`);

            const clientes = await resClientes.json();
            const fornecedores = await resFornecedores.json();

            // Mapeia os dados tratando maiúsculas e minúsculas vindas da API
            const clientesFormatados = clientes.map(c => ({
                id: c.id || c.Id,
                nome: c.nome || c.Nome,
                telefone: c.telefone || c.Telefone,
                tipo: 'Cliente'
            }));

            const fornecedoresFormatados = fornecedores.map(f => ({
                id: f.id || f.Id,
                nome: f.nome || f.Nome,
                telefone: f.telefone || f.Telefone,
                tipo: 'Fornecedor'
            }));

            // Une as listas e ordena alfabeticamente
            listaFinal = [...clientesFormatados, ...fornecedoresFormatados];
            listaFinal.sort((a, b) => a.nome.localeCompare(b.nome));
        }

        // Limpa a tabela antes de adicionar as novas linhas
        corpoTabela.innerHTML = '';

        // Renderiza cada item como uma linha de tabela (tr)
        listaFinal.forEach(item => {
            const linha = document.createElement('tr');
            
            // Define a cor para a identificação do Tipo (Amarelo para Cliente, Laranja para Fornecedor)
            const corTipo = item.tipo === 'Cliente' ? '#ffd700' : '#2ecc71';

            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.telefone}</td>
                <td style="color: ${corTipo}; font-weight: bold; font-size: 12px; letter-spacing: 1px;">
                    ${item.tipo.toUpperCase()}
                </td>
                <td style="text-align: right;">
                    <span style="cursor: pointer; margin-right: 15px; color: #888;" onclick="editarItem(${item.id}, '${item.tipo}')">Editar</span>
                    <span style="cursor: pointer; color: #ff4d4d; font-weight: 500;" onclick="excluirItem(${item.id}, '${item.tipo}')">Excluir</span>
                </td>
            `;

            // Coloca a linha dentro do corpo da tabela
            corpoTabela.appendChild(linha);
        });

    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao carregar dados. Verifique se o back-end está ativo na porta 7093.');
    }
}

function editarItem(id, tipo) {
    alert(`Editar ${tipo} (ID: ${id})`);
}

async function excluirItem(id, tipo) {
    if (confirm(`Deseja realmente excluir este ${tipo}?`)) {
        if (USAR_DADOS_DE_TESTE) {
            alert(`${tipo} excluído (Simulação)!`);
            return;
        }

        const urlDeExclusao = tipo === 'Cliente' ? `${URL_CLIENTES}/${id}` : `${URL_FORNECECORES}/${id}`;

        try {
            const response = await fetch(urlDeExclusao, { method: 'DELETE' });
            if (response.ok) {
                alert(`${tipo} deletado com sucesso!`);
                carregarDadosUnificados();
            } else {
                alert('Erro ao deletar o registro.');
            }
        } catch (erro) {
            console.error(`Erro ao deletar ${tipo}:`, erro);
        }
    }
}


function obterDadosFicticios() {
    return [
        { id: 1, nome: "Ana Clara", telefone: "(14)12345-6789", tipo: "Cliente" },
        { id: 2, nome: "Larissa Goumer", telefone: "(14)775849-5678", tipo: "Fornecedor" }
    ];
}