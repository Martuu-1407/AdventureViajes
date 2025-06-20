document.querySelectorAll(".select-flight-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const card = btn.closest(".flight-card");

    const vuelo = {
      origen: card.dataset.origen,
      destino: card.dataset.destino,
      fecha: card.dataset.fecha,
      precio: card.dataset.precio,
    };

    const res = await fetch("/guardar-vuelo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vuelo),
    });

    if (res.ok) {
      alert("Vuelo agregado al carrito");
      // Podés redirigir si querés:
      // window.location.href = "/carrito.html";
    } else {
      alert("Error al guardar vuelo");
    }
  });
});
