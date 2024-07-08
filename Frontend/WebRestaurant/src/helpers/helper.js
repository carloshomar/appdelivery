function formatCurrency(value) {
  // Formate o valor como dinheiro brasileiro (BRL)
  try {
    const formattedValue = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  } catch (e) {
    return value;
  }
}

const genCode = (str, multiplicar) => {
  const numerosEncontrados = str.match(/\d+/g);

  if (!numerosEncontrados) {
    return "0000";
  }

  let codigo = numerosEncontrados.slice(0, 4).join("").slice(0, 4);

  if (multiplicar) {
    if (multiplicar === 1) {
      multiplicar = 2;
    }
    codigo = (parseInt(codigo, 10) * multiplicar).toString().slice(0, 4);
  }

  return codigo;
};
function isMobile() {
  return window.innerWidth < 768;
}

export default { genCode, formatCurrency, isMobile };
