// Substitua pela URL real da sua API (ex: 'http://localhost:3000/pedidos')
const API_URL = 'https://localhost:7093/api/Venda'; 

async function carregarPedidos() {
    const listaContainer = document.getElementById('lista-pedidos');
    
    try {
        // 1. Faz a requisição para a API
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        
        // 2. Transforma a resposta em JSON
        const pedidos = await response.json();
        
        // Limpa o container antes de renderizar (caso tenha algum HTML estático de teste)
        listaContainer.innerHTML = '';
        
        // 3. Percorre cada pedido e cria o HTML dinâmico
        pedidos.forEach(pedido => {
            
            // Tratamento da classe do status para manter as cores verde/vermelho do seu CSS
            // Se na API vier "Em andamento", vira "andamento". Se vier "Cancelado", vira "cancelado".
            const statusClasse = pedido.status.toLowerCase() === 'em andamento' ? 'andamento' : 'cancelado';
            
            // Formatação do valor para a moeda Real (R$)
            const valorFormatado = pedido.total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            // Cria o elemento do card do pedido
            const pedidoItem = document.createElement('div');
            pedidoItem.classList.add('pedido-item');
            
            // Injeta as variáveis do banco de dados nas posições certas do seu layout grid
            pedidoItem.innerHTML = 
            ` <div>ID: ${pedido.id}</div>
              <div class="nome-cliente">${pedido.nome}</div>
              <div class="status ${statusClasse}" style="text-align: center;">${pedido.status}</div>
              <div class="total">Total: ${valorFormatado}</div> `;
            
            // Coloca o novo item dentro da lista na tela
            listaContainer.appendChild(pedidoItem);
        });

    } catch (error) {
        console.error('Erro:', error);
        listaContainer.innerHTML = `<p style="color: #FF5C5C; text-align: center;">Não foi possível carregar os pedidos.</p>`;
    }
}

        document.addEventListener('DOMContentLoaded', carregarPedidos);