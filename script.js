const produtos = [
  {
    nome: "Camiseta",
    tipo: "Entrada",
    quantidade: 50,
    preco: 79.90,
    data: "22/04/26"
  },
  {
    nome: "Calça",
    tipo: "Saída",
    quantidade: 5,
    preco: 120.00,
    data: "22/04/26"
  },
  {
    nome: "Tênis",
    tipo: "Entrada",
    quantidade: 15,
    preco: 250.00,
    data: "22/04/26"
  }
];

function definirCor(qtd) {
  if (qtd > 30) return "verde";
  if (qtd > 10) return "amarelo";
  return "vermelho";
}

function renderizarTabela() {
  const tbody = document.getElementById("corpo-tabela");

  produtos.forEach(produto => {
    const cor = definirCor(produto.quantidade);

    const linha = `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.tipo}</td>
        <td class="${cor}">${produto.quantidade} unidades</td>
        <td>R$${produto.preco.toFixed(2)}</td>
        <td>${produto.data}</td>
        <td><a href="#">Editar</a></td>
      </tr>
    `;

    tbody.innerHTML += linha;
  });
}

renderizarTabela();