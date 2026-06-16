// URLs da sua API local (Porta 7093)
const URL_CLIENTE = 'https://localhost:7093/api/Cliente';
const URL_FORNECEDOR = 'https://localhost:7093/api/Fornecedor';

// Captura o formulário de cadastro
const formCadastro = document.querySelector('form');

formCadastro.addEventListener('submit', async (event) => {
    // Evita o recarregamento padrão da página
    event.preventDefault();

    // Capturando o tipo selecionado no <select> (id="tipo")
    const tipoUsuario = document.getElementById('tipo').value;

    // Montando o objeto com todos os campos da imagem
    const dadosFormulario = {
        nomeEmpresa: document.getElementById('nome').value,
        dataNascimento: document.getElementById('data-nascimento').value,
        bairro: document.getElementById('bairro').value,
        email: document.getElementById('email').value,
        produtoServico: document.getElementById('produto-servico').value,
        numeroCasa: document.getElementById('numero-casa').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value,
        complemento: document.getElementById('complemento').value,
        cnpj: document.getElementById('cnpj').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        endereco: document.getElementById('endereco').value,
        tipo: tipoUsuario
    };

    // Define para qual URL enviar baseado na escolha do Select
    let urlDestino = '';
    
    // O .toLowerCase() garante que funcione mesmo se o valor for "Cliente" ou "cliente"
    if (tipoUsuario.toLowerCase() === 'cliente') {
        urlDestino = URL_CLIENTE;
    } else if (tipoUsuario.toLowerCase() === 'fornecedor') {
        urlDestino = URL_FORNECEDOR;
    } else {
        alert('Por favor, selecione se é Cliente ou Fornecedor no campo "Tipo".');
        return;
    }

    try {
        // Realiza a requisição POST para a API selecionada
        const response = await fetch(urlDestino, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosFormulario)
        });

        if (response.ok) {
            alert(`${tipoUsuario} cadastrado com sucesso!`);
            formCadastro.reset(); // Limpa a tela após o sucesso
        } else {
            const erroTexto = await response.text();
            alert(`Erro no cadastro (${response.status}): ${erroTexto}`);
        }
    } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        alert('Não foi possível conectar à API local. Verifique se o seu backend está rodando na porta 7093.');
    }
});