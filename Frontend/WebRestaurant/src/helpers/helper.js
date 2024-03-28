function formatCurrency(value) {
  // Formate o valor como dinheiro brasileiro (BRL)
  try {
    const formattedValue = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  } catch (e) {
    return "";
  }
}

export default {
  formatCurrency,
};
