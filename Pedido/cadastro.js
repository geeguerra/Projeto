const form = document.querySelector(".order-form");

const btnAdd = document.querySelector(".btn-add");

const produtoSelect = document.querySelector(".input-with-btn select");

const quantidadeInput = document.querySelector(".quantidade");

const resumoPedido = document.querySelector(".order-summary");

const totalTexto = document.querySelector(".total-text strong");

let total = 0;


btnAdd.addEventListener("click", () => {

    const produto = produtoSelect.value;

    const quantidade = quantidadeInput.value;

    if (produto === "Selecionar" || quantidade === "") {

        alert("Selecione um produto e a quantidade!");
        return;
    }

    const valorProduto = 10;

    const subtotal = valorProduto * quantidade;

    total += subtotal;

    const novoItem = document.createElement("div");

    novoItem.classList.add("summary-item");

    novoItem.innerHTML = `
    
        <span>${produto} x${quantidade}</span>
        <span>R$ ${subtotal.toFixed(2)}</span>

    `;

    resumoPedido.insertBefore(
        novoItem,
        document.querySelector(".summary-footer")
    );

    totalTexto.innerText = `R$ ${total.toFixed(2)}`;

    quantidadeInput.value = "";
});


form.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Pedido salvo com sucesso!");

    form.reset();

    total = 0;

    totalTexto.innerText = "R$ 0,00";

});