document.addEventListener('DOMContentLoaded', () => {
    let todosOsPedidos = [];
    const containerListagem = document.querySelector('.card-container') || 
                               document.querySelector('.card') || 
                               document.querySelector('main > div') ||
                               document.querySelector('main');
                               
    const inputBusca = document.querySelector('input[placeholder="Buscar produto"]');
    carregarPedidos();

    function carregarPedidos() {
        console.log("Modo de gerenciamento local ativo via LocalStorage.");
        const historicoLocal = JSON.parse(localStorage.getItem('pedidos_locais')) || [];

        if (historicoLocal.length === 0) {
            todosOsPedidos = [
                { id: 1, status: "Em andamento", total: 160.00, clienteId: 12 },
                { id: 2, status: "Concluído", total: 20.00, clienteId: 5 }
            ];
            localStorage.setItem('pedidos_locais', JSON.stringify(todosOsPedidos));
        } else {
            todosOsPedidos = historicoLocal;
        }

        renderizarCardsDePedidos(todosOsPedidos);
    }
    function renderizarCardsDePedidos(listaDePedidos) {
        if (!containerListagem) return;

        const itensAntigos = containerListagem.querySelectorAll('.pedido-card-item, .mensagem-vazia');
        itensAntigos.forEach(item => item.remove());

        listaDePedidos.forEach(pedido => {
            const card = document.createElement('div');
            card.className = "pedido-card-item";
            card.style.backgroundColor = "#242424";
            card.style.border = "1px solid #3a3a3a";
            card.style.borderRadius = "6px";
            card.style.padding = "18px";
            card.style.marginTop = "15px";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.gap = "12px";

            const statusLower = (pedido.status || "").toLowerCase();
            let corBadge = "#524516"; // Amarelado
            let corTexto = "#ffd54f";

            if (statusLower.includes("concl")) {
                corBadge = "#1e4620"; // Verde
                corTexto = "#81c784";
            } else if (statusLower.includes("cancel")) {
                corBadge = "#5c1e1e"; // Vermelho
                corTexto = "#e57373";
            }

            const totalExibicao = parseFloat(pedido.total) || 0;

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 8px;">
                    <span style="color: #ffffff; font-weight: bold; font-size: 15px;">Pedido #${pedido.id || '---'}</span>
                    <span style="background-color: ${corBadge}; color: ${corTexto}; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500;">
                        ${pedido.status || 'Em andamento'}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 14px;">
                    <div style="color: #cccccc;">
                        <p style="margin: 3px 0;"><strong>Cliente ID:</strong> ${pedido.clienteId || '1'}</p>
                    </div>
                    <div style="text-align: right; color: #D4AF37; font-weight: bold; font-size: 18px;">
                        R$ ${totalExibicao.toFixed(2).replace('.', ',')}
                    </div>
                </div>
            `;

            containerListagem.appendChild(card);
        });
    }
    if (inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            
            if (!termo) {
                renderizarCardsDePedidos(todosOsPedidos);
                return;
            }

            const filtrados = todosOsPedidos.filter(p => 
                String(p.id).includes(termo) || 
                (p.status || "").toLowerCase().includes(termo) ||
                String(p.clienteId || "").includes(termo)
            );
            
            renderizarCardsDePedidos(filtrados);
        });
    }
});