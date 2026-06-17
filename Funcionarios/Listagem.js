const API_URL = " http://localhost:5104/api/Funcionario"; 

async function carregarFuncionarios() {
    const lista = document.getElementById('lista-funcionarios');
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao aceder à API");
        
        const funcionarios = await response.json();
        lista.innerHTML = ""; 

        funcionarios.forEach(func => {
            const linha = document.createElement('div');
            linha.className = 'linha-grid'; 
            
            linha.innerHTML = `
                <span>${func.nome}</span>
                <span>${func.cargo}</span>
                <span>R$ ${func.salario}</span>
                <div class="acoes">
                    <button onclick="editarFuncionario(${func.id})" class="btn-edit"> <a href="Cadastro.html">Editar</a></button>
                    <button onclick="deletarFuncionario(${func.id})" class="btn-delete">Excluir</button>
                </div>
            `;
            lista.appendChild(linha);
        });
    } catch (error) {
        console.error("Erro:", error);
        lista.innerHTML = `<p style="color: #ffcc00; text-align: center; margin-top: 20px;">
            Aguardando conexão com a API...
        </p>`;
    }
}

function editarFuncionario(id) {
    window.location.href = `../Cadastro/cadastro.html?id=${id}`;
}

async function deletarFuncionario(id) {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            carregarFuncionarios(); 
        } catch (error) {
            alert("Erro ao eliminar.");
        }
    }
}

carregarFuncionarios();