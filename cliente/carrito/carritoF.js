fetch("/obtener-nombre", {
  credentials: "include", // 🔥 Necesario para que se envíen las cookies
})
  .then((res) => {
    if (!res.ok) throw new Error("No autorizado");
    return res.json();
  })
  .then((data) => {
    document.getElementById("nombre").textContent = data.nombre;
  })
  .catch((error) => {
    console.error("Error al obtener el nombre:", error);
    document.getElementById("nombre").textContent = "Invitado";
  });
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  return `${año}-${mes}-${dia} ${horas}:${minutos}`;
}

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/obtener-vuelos");
  const vuelos = await res.json();

  const contenedor = document.querySelector(".pedidos");
  contenedor.innerHTML = "";

  vuelos.forEach((vuelo) => {
    const div = document.createElement("div");
    div.className = "pedido";
    div.innerHTML = `
      <img src="https://i.ibb.co/v4z7Xw3T/X-circle.png" alt="X-circle" border="0">
      <h3>${vuelo.origen}</h3>
      <hr class="vertical-line" />
      <h3>${vuelo.destino}</h3>
      <hr class="vertical-line" />
      <p><b>Fecha:</b> ${formatearFecha(vuelo.fecha)}</p>
      <hr class="vertical-line" />
      <p><b>Precio:</b> $${vuelo.precio}</p>
    `;
    contenedor.appendChild(div);
  });
});
