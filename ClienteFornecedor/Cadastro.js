document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const dadosForm = Object.fromEntries(formData.entries());

        const tipoUsuario = dadosForm.tipo;
        if (!tipoUsuario) {
            alert("Por favor, selecione se é Cliente ou Fornecedor.");
            return;
        }

        const payload = {
            nome: dadosForm.nome,
            dataNascimento: dadosForm.dataNascimento || null,
            email: dadosForm.email,
            telefone: dadosForm.telefone,
            cep: dadosForm.cep,
            endereco: dadosForm.endereco, 
            bairro: dadosForm.bairro,
            numeroCasa: dadosForm.numeroCasa, 
            complemento: dadosForm.complemento,
            cidade: dadosForm.cidade,
            estado: dadosForm.estado,
            cnpj: dadosForm.cnpj,
            produtoServico: dadosForm.produtoServico,
            tipo: tipoUsuario
        };

        let urlDestino = tipoUsuario.toLowerCase() === "cliente" 
            ? " http://localhost:5104/api/Cliente" 
            : " http://localhost:5104/api/Fornecedor";

        try {
            const resposta = await fetch(urlDestino, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (resposta.ok) {
                alert(`${tipoUsuario} cadastrado com sucesso!`);
                form.reset();
            } else {
                const detalheErro = await resposta.text();
                alert(`O servidor recusou os dados (Status ${resposta.status}).\n\nMotivo:\n${detalheErro}`);
            }

        } catch (erro) {
            alert("Não foi possível conectar com o servidor!\n\nVerifique se o seu projeto está aberto e rodando (Play) no Visual Studio.");
        }
    });
});