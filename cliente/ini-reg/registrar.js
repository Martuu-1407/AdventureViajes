document.getElementById("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  const respuesta = await fetch("http://localhost:3000/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, contrasena }),
  });

  const resultado = await respuesta.text();
  alert(resultado);
});
