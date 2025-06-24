document.addEventListener("DOMContentLoaded", () => {
  const currencyMenu = document.getElementById("currencyMenu");
  const currentFlag = document.getElementById("currentFlag");
  const currentCode = document.getElementById("currentCode");

  // Tasas de conversión con base en AR$
  const tasas = {
    AR$: 1,
    USD: 0.0053, // Ejemplo: 1 AR$ = 0.0053 USD
    R$: 0.028, // Ejemplo Reales
    EU: 0.0048, // Ejemplo Euros
  };

  // Símbolos para cada moneda
  const simbolos = {
    AR$: "$",
    USD: "US$",
    R$: "R$",
    EU: "€",
  };

  currencyMenu.addEventListener("click", (e) => {
    const opcion = e.target.closest(".currency-option");
    if (!opcion) return;

    const nuevoCodigo = opcion.dataset.code;
    const nuevaBandera = opcion.dataset.flag;

    currentCode.textContent = nuevoCodigo;
    currentFlag.textContent = nuevaBandera;

    const tasa = tasas[nuevoCodigo];
    const simbolo = simbolos[nuevoCodigo];

    actualizarPreciosYSimbolo(tasa, simbolo);
  });

  function actualizarPreciosYSimbolo(tasa, simbolo) {
    document.querySelectorAll(".price-info").forEach((info) => {
      const priceElem = info.querySelector(".price");
      const simboloElem = info.querySelector(".currency-symbol");

      if (!priceElem || !simboloElem) return;

      // Tomamos el precio original del atributo data
      const precioOriginal = info.dataset.precioOriginal;

      if (!precioOriginal) return;

      const precioNum = Number(precioOriginal);
      if (isNaN(precioNum)) return;

      const nuevoPrecio = precioNum * tasa;

      // Actualizar texto con formato local sin decimales
      priceElem.textContent = nuevoPrecio.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      simboloElem.textContent = simbolo;
    });
  }
});
