document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".card-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const tipo = document.getElementById("tipo").value;
        let url = "";

        if (tipo === "Cliente") {
            url = "https://localhost:7093/api/Cliente";
        } else if (tipo === "Fornecedor") {
            url = "https://localhost:7093/api/Fornecedor";
        } else {
            alert("Selecione Cliente ou Fornecedor.");
            return;
        }

      
  // 1. Coleta a estrutura base idêntica à que funcionou no seu Swagger
        let dados = {
            id: 0,
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            cep: document.getElementById("cep").value,
            "Endereço": document.getElementById("endereco").value, // Corrigido para bater com a API!
            bairro: document.getElementById("bairro").value,
            numeroCasa: document.getElementById("numeroCasa").value,
            complemento: document.getElementById("complemento").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value
    
        };

        // 2. Adiciona as propriedades específicas de cada um (sem inventar campos extras)
        if (tipo === "Cliente") {
            dados.cpf = document.getElementById("cpf").value;
            dados.dataNascimento = document.getElementById("dataNascimento").value;
        } else if (tipo === "Fornecedor") {
            dados.cnpj = document.getElementById("cnpj").value;
            // 'produtoServico' foi removido daqui pois não existe no seu Swagger!
        }

        console.log(`Enviando dados para ${tipo}:`, JSON.stringify(dados, null, 2));

        try {
            const resposta = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                body: JSON.stringify(dados)
            });

            if (resposta.ok) {
                alert(`✅ ${tipo} cadastrado com sucesso!`);
                form.reset();
            } else {
                const erro = await resposta.text();
                console.error("Erro retornado pela API:", erro);
                alert(`❌ Erro no servidor ao cadastrar ${tipo}. Abra o Console (F12) para ver os detalhes.`);
            }

        } catch (erro) {
            console.error("Erro de conexão:", erro);
            alert("❌ Não foi possível conectar ao servidor. Verifique se a API está rodando.");
        }
    });
});