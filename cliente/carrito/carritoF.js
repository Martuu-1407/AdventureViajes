// Obtener nombre del usuario (si está autenticado)
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

// Función para formatear la fecha
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Cargar los vuelos al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/obtener-vuelos");
    const vuelos = await res.json();

    const contenedor = document.querySelector(".pedidos");
    contenedor.innerHTML = "";

    vuelos.forEach((vuelo) => {
      const div = document.createElement("div");
      div.className = "pedido";
      div.dataset.id = vuelo.id_vuelo;

      div.innerHTML = `
        <img src="https://i.ibb.co/v4z7Xw3T/X-circle.png" alt="X-circle" class="btn-borrar" style="cursor:pointer;" />
        <h3>${vuelo.origen}</h3>
        <hr class="vertical-line" />
        <h3>${vuelo.destino}</h3>
        <hr class="vertical-line" />
        <p><b>Salida:</b> ${formatearFecha(vuelo.fecha)}</p>
        <hr class="vertical-line" />
        <p><b>Precio:</b> $${vuelo.precio}</p>
      `;

      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error("Error al obtener vuelos:", error);
  }
});

// Delegación de eventos para borrar vuelos
document.querySelector(".pedidos").addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-borrar")) {
    const vueloDiv = e.target.closest(".pedido");
    const vueloId = vueloDiv.dataset.id;
    console.log("ID capturado desde dataset:", vueloId);
    console.log("Tipo de dato:", typeof vueloId);

    try {
      const res = await fetch("/borrar-vuelo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_vuelo: Number(vueloId) }),
      });

      if (res.ok) {
        vueloDiv.remove(); // Eliminar del DOM
      } else {
        alert("Error al eliminar el vuelo");
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
      alert("Fallo la conexión con el servidor");
    }
  }
});
