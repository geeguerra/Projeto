document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const dados = {
            nome: document.getElementById("nome").value,
            dataNascimento: document.getElementById("dataNascimento").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            cpf: document.getElementById("cpf").value,
            cnpj: document.getElementById("cnpj").value,
            produtoServico: document.getElementById("produtoServico").value,
            cep: document.getElementById("cep").value,
            endereco: document.getElementById("endereco").value,
            bairro: document.getElementById("bairro").value,
            numero: document.getElementById("numero").value,
            complemento: document.getElementById("complemento").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value,
            tipo: document.getElementById("tipo").value
        };

        try {
            const resposta = await fetch(
                "http://localhost:3000/clientes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                }
            );

            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!");
                form.reset();
            } else {
                alert("Erro ao cadastrar.");
            }

        } catch (erro) {
            console.error(erro);
            alert("Erro ao conectar com o servidor.");
        }
    });
});