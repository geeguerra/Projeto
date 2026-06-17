const form = document.getElementById("formCadastro");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
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
        return; 
    }

    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const salario = parseFloat(document.getElementById("salario").value);

    const payload = {
        id: 0,
        nome: nome,
        cargo: cargo,
        salario: salario
    };

    try {

        const urlAPI = " http://localhost:5104/api/Funcionario"; 

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
            inputs.forEach(input => input.style.border = "1px solid #444");
        } else {
            alert("Erro ao salvar o funcionário no servidor. Status: " + response.status);
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível conectar ao servidor. Verifique se a API está rodando e se o CORS está ativo.");
    }
});