// Tasa de cambio manual (o más adelante podés usar una API para hacerlo dinámico)
const tasaCambioUSD = 0.0008403; // 1 ARS = 0.0008403 USD
const tasaCambioRE = 0.004671; // 1ARS = 0.004671 RE
const tasaCambioEUR = 0.0007209; // 1 ARS = 0.0007209 EUR

const currencyOptions = document.querySelectorAll(".currency-option");
const precios = document.querySelectorAll(".cambio");

currencyOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const currencyCode = option.dataset.code;

    precios.forEach((precio) => {
      const valorOriginal = parseFloat(precio.dataset.precio);

      if (currencyCode === "USD") {
        const valorConvertido = (valorOriginal * tasaCambioUSD).toFixed(2);
        precio.textContent = `USD $${valorConvertido}`;
      } else if (currencyCode === "AR$") {
        precio.textContent = `AR$ ${valorOriginal.toLocaleString("es-AR")}`;
      } else if (currencyCode === "R$") {
        const valorConvertido = (valorOriginal * tasaCambioRE).toFixed(2);
        precio.textContent = `R$ $${valorConvertido}`;
      } else if (currencyCode === "EU") {
        const valorConvertido = (valorOriginal * tasaCambioEUR).toFixed(2);
        precio.textContent = ` €${valorConvertido}`;
      }
    });
  });
});
