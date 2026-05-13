let funcionarios = [];
let editIndex = null;

function salvar() {
    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const salario = document.getElementById("salario").value;

    if (!nome || !cargo || !salario) {
        alert("Preencha todos os campos!");
        return;
    }

    const funcionario = { nome, cargo, salario };

    if (editIndex === null) {
        funcionarios.push(funcionario);
    } else {
        funcionarios[editIndex] = funcionario;
        editIndex = null;
    }

    limparCampos();
    renderizar();
}

function renderizar() {
    const lista = document.getElementById("lista-funcionarios");
    lista.innerHTML = "";

    funcionarios.forEach((f, index) => {
        lista.innerHTML += `
            <div class="linha">
                <span>${f.nome}</span>
                <span>${f.cargo}</span>
                <span>R$ ${f.salario}</span>
                <span>
                    <button onclick="editar(${index})">Editar</button>
                    <button onclick="excluir(${index})">Excluir</button>
                </span>
            </div>
        `;
    });
}

function editar(index) {
    const f = funcionarios[index];

    document.getElementById("nome").value = f.nome;
    document.getElementById("cargo").value = f.cargo;
    document.getElementById("salario").value = f.salario;

    editIndex = index;
}

function excluir(index) {
    if (confirm("Deseja excluir este funcionário?")) {
        funcionarios.splice(index, 1);
        renderizar();
    }
}

function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("salario").value = "";
}