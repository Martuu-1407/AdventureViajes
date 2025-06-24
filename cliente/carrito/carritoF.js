// Obtener nombre del usuario (si está autenticado)
fetch("/obtener-nombre", {
  credentials: "include",
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

// Función para calcular y mostrar el total
function calcularTotal(items) {
  let total = 0;
  items.forEach((item) => {
    total += Number(item.precio);
  });
  document.getElementById("total").textContent = total.toLocaleString("es-AR");
}

// Función para formatear fecha
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

async function cargarCarrito() {
  const contenedor = document.querySelector(".pedidos");
  contenedor.innerHTML = "";

  let total = 0;

  try {
    // Traer vuelos
    const resVuelos = await fetch("/obtener-vuelos");
    const vuelos = await resVuelos.json();

    vuelos.forEach((vuelo) => {
      const div = document.createElement("div");
      div.className = "pedido";
      div.dataset.tipo = "vuelo";
      div.dataset.id = vuelo.id_vuelo;

      div.innerHTML = `
        <img src="https://i.ibb.co/v4z7Xw3T/X-circle.png" alt="X-circle" class="btn-borrar" style="cursor:pointer;" />
        <h3>${vuelo.origen} → ${vuelo.destino}</h3>
        <hr class="vertical-line" />
        <p><b>Salida:</b> ${formatearFecha(vuelo.fecha)}</p>
        <hr class="vertical-line" />
        <p><b>Precio:</b> $${Number(vuelo.precio).toLocaleString("es-AR")}</p>
      `;

      contenedor.appendChild(div);
      total += Number(vuelo.precio);
    });

    // Traer paquetes
    const resPaquetes = await fetch("/obtener-paquetes");
    const paquetes = await resPaquetes.json();

    paquetes.forEach((paquete) => {
      const div = document.createElement("div");
      div.className = "pedido";
      div.dataset.tipo = "paquete";
      div.dataset.id = paquete.id_paquete;

      div.innerHTML = `
        <img src="https://i.ibb.co/v4z7Xw3T/X-circle.png" alt="X-circle" class="btn-borrar" style="cursor:pointer;" />
        <h3>${paquete.destino}</h3>
        <hr class="vertical-line" />
        <p><b>Fecha:</b> ${formatearFecha(paquete.fecha)}</p>
        <hr class="vertical-line" />

        <p><b>Pasajeros:</b> ${paquete.pasajeros}</p>
        <hr class="vertical-line" />
        <p><b>Precio:</b> $${Number(paquete.precio).toLocaleString("es-AR")}</p>
      `;

      contenedor.appendChild(div);
      total += Number(paquete.precio);
    });

    document.getElementById("total").textContent =
      total.toLocaleString("es-AR");
  } catch (error) {
    console.error("Error al cargar carrito:", error);
  }
}

window.addEventListener("DOMContentLoaded", cargarCarrito);

document.querySelector(".pedidos").addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-borrar")) {
    const pedidoDiv = e.target.closest(".pedido");
    const id = pedidoDiv.dataset.id;
    const tipo = pedidoDiv.dataset.tipo; // "vuelo" o "paquete"

    let endpoint;
    let bodyData;

    if (tipo === "vuelo") {
      endpoint = "/borrar-vuelo";
      bodyData = { id_vuelo: Number(id) };
    } else if (tipo === "paquete") {
      endpoint = "/borrar-paquete";
      bodyData = { id_paquete: Number(id) };
    } else {
      alert("Tipo de item desconocido");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        // Remover el item del DOM
        pedidoDiv.remove();
        // Recargar el carrito para recalcular total y refrescar la lista
        cargarCarrito();
      } else {
        const errorText = await res.text();
        alert("Error al eliminar el item: " + errorText);
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
      alert("Fallo la conexión con el servidor");
    }
  }
});
