const cardform  = document.getElementById("formCadastro");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const inputs = form.querySelectorAll("input, select");

    let formularioValido = true;

    inputs.forEach(input => {

        if(input.value.trim() === "") {

            input.style.border = "1px solid red";
            formularioValido = false;

        } else {

            input.style.border = "1px solid #444";
        }

    });

    if(formularioValido) {

        alert("Cadastro realizado com sucesso!");
        form.reset();

    } else {

        alert("Preencha todos os campos obrigatórios!");

    }

});const form = document.getElementById("formCadastro");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const inputs = form.querySelectorAll("input, select");

    let formularioValido = true;

    inputs.forEach(input => {

        if(input.value.trim() === "") {

            input.style.border = "1px solid red";
            formularioValido = false;

        } else {

            input.style.border = "1px solid #444";
        }

    });

    if(formularioValido) {

        alert("Cadastro realizado com sucesso!");
        form.reset();

    } else {

        alert("Preencha todos os campos obrigatórios!");

    }

});
