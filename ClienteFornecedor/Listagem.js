// =========================================================================
// CONFIGURAÇÃO: URLs reais da sua API local
// =========================================================================
const URL_CLIENTES = 'https://localhost:7093/api/Cliente'; 
const URL_FORNECECORES = 'https://localhost:7093/api/Fornecedor'; 

// Mude para 'false' para puxar direto do seu banco de dados através da API
const USAR_DADOS_DE_TESTE = false; 

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosUnificados();
});

async function carregarDadosUnificados() {
    // SELEÇÃO INTELIGENTE:
    // Pegamos a primeira div dentro do corpo da página que tem um botão (que é o seu card)
    const containerLista = document.querySelector('button')?.parentElement?.parentElement || document.body;
    
    // Pegamos o container do botão "Cadastrar" (o pai direto do button) para usarmos como âncora
    const elementoAncoragem = document.querySelector('button')?.parentElement;

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

            // Mapeia os dados aceitando propriedades Minúsculas ou Maiúsculas vindas da API
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

            // Une e ordena por ordem alfabética
            listaFinal = [...clientesFormatados, ...fornecedoresFormatados];
            listaFinal.sort((a, b) => a.nome.localeCompare(b.nome));
        }

        // Limpa registros antigos gerados dinamicamente
        removerLinhasAntigas(containerLista);

        // Renderiza cada item dentro do card com a nova coluna de "Tipo"
        listaFinal.forEach(item => {
            const linha = document.createElement('div');
            // Usamos exatamente a classe que você já estilizou no seu projeto
            linha.className = 'linha-registro dinamicamente-adicionada'; 
            
            // Estilos de alinhamento mantendo o padrão do seu layout
            linha.style.display = 'flex';
            linha.style.justifyContent = 'space-between';
            linha.style.alignItems = 'center';
            linha.style.padding = '12px 0';
            linha.style.width = '100%';

            // Define a cor da tag (Amarelo ouro para Cliente, Laranja escuro para Fornecedor)
            const corTipo = item.tipo === 'Cliente' ? '#ffd700' : '#e67e22';

            linha.innerHTML = `
                <span style="flex: 1.2; text-align: left; color: #fff;">${item.nome}</span>
                <span style="flex: 1.2; text-align: left; color: #aaa;">${item.telefone}</span>
                <span style="flex: 1; color: ${corTipo}; font-weight: bold; font-size: 11px; letter-spacing: 1px; text-align: left;">
                    ${item.tipo.toUpperCase()}
                </span>
                <div style="flex: 1; text-align: right; font-size: 14px;">
                    <span style="cursor: pointer; margin-right: 15px; color: #888;" onclick="editarItem(${item.id}, '${item.tipo}')">Editar</span>
                    <span style="cursor: pointer; color: #ff4d4d; font-weight: 500;" onclick="excluirItem(${item.id}, '${item.tipo}')">Excluir</span>
                </div>
            `;

            // Insere dinamicamente dentro do card, logo antes do bloco do botão Cadastrar
            if (elementoAncoragem) {
                containerLista.insertBefore(linha, elementoAncoragem);
            } else {
                containerLista.appendChild(linha);
            }
        });

    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao carregar dados. Verifique o console do navegador e se o back-end está ativo.');
    }
}

function removerLinhasAntigas(container) {
    const linhas = container.querySelectorAll('.dinamicamente-adicionada');
    linhas.forEach(linha => linha.remove());
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
        { id: 2, nome: "Larissa Goumer", telefone: "(14)775849-5678", tipo: "Fornecedor" },
        { id: 3, nome: "Pedro Henrique", telefone: "(14)22334-6687", tipo: "Cliente" },
        { id: 4, nome: "Antonio Santos", telefone: "(14)34568-7543", tipo: "Fornecedor" }
    ];
}