document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('form');
    
    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault(); // Trava o recarregamento da página

            const nomeInput = document.getElementById('nome').value;
            const codigoInput = document.getElementById('codigo').value;
            const estoqueInput = document.getElementById('estoque').value;
            const precoInput = document.getElementById('preco').value;

            // Cria o objeto exatamente igual ao Swagger
            const dadosProduto = {
                nomeProduto: nomeInput,
                codigo: parseInt(codigoInput) || 0,
                quantidadeEstoque: parseInt(estoqueInput) || 0,
    
                preco: parseFloat(precoInput.replace('R$', '').replace(',', '.').trim()) || 0
            };
            console.log("JSON QUE O FRONT ESTÁ GERANDO:", JSON.stringify(dadosProduto));

            const URL_API = ' http://localhost:5104/api/Produtos'; 

            try {
                const response = await fetch(URL_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosProduto)
                });

                if (response.ok) {
                    alert('Produto cadastrado com sucesso pelo Front!');
                    formulario.reset(); 
                } else {
                    // Se der erro, vamos ler o que a API respondeu de erro no console
                    const textoErro = await response.text();
                    console.error('Resposta de erro detalhada do servidor:', textoErro);
                    alert(`Erro ${response.status}: Olhe o console para ver o motivo que o C# retornou.`);
                }

            } catch (error) {
                console.error('Erro de conexão:', error);
            }
        });
    }
});