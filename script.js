let id = 1;

function adicionarLinha() {
  const input = document.getElementById("inputPadrao");
  const valor = input.value.trim();

  if (!valor) {
    alert("Digite um valor!");
    return;
  }

  const tbody = document.getElementById("tableBody");

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${id}</td>
    <td>${valor}</td>
  `;

  tbody.appendChild(tr);

  id++;
  input.value = "";
}