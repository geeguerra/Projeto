const form = document.getElementById("formCadastro");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Seleciona apenas os inputs do novo formulário
    const inputs = form.querySelectorAll("input");
    let formularioValido = true;

    inputs.forEach(input => {
        if (input.value.trim() === "") {
            input.style.border = "1px solid red";
            formularioValido = false;
        } else {
            input.style.border = "1px solid #444";
        }
    });

    if (!formularioValido) {
        alert("Preencha todos os campos obrigatórios!");
        return; // Para a execução aqui se houver erro
    }

    // Captura os valores dos campos correspondentes ao Swagger
    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    // Converte o salário para número (float)
    const salario = parseFloat(document.getElementById("salario").value);

    // Monta o objeto exatamente como a API espera
    const payload = {
        id: 0,
        nome: nome,
        cargo: cargo,
        salario: salario
    };

    try {
        // Lembre-se de confirmar se a porta da sua API é a 5081 olhando a aba do seu Swagger!
        const urlAPI = "http://localhost:5081/api/Funcionario"; 

        const response = await fetch(urlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            form.reset();
            // Reseta as bordas para o padrão após o sucesso
            inputs.forEach(input => input.style.border = "1px solid #444");
        } else {
            alert("Erro ao salvar o funcionário no servidor. Status: " + response.status);
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível conectar ao servidor. Verifique se a API está rodando e se o CORS está ativo.");
    }
});