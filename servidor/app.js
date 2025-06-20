const http = require("http");
const fs = require("fs");
const path = require("path");
const conexion = require("./db/conexion.js"); // adaptá el path si es diferente

const server = http.createServer((req, res) => {
  // Página de inicio (sesion.html)
  if (req.url === "/" && req.method === "GET") {
    const filePath = path.join(__dirname, "ini-reg", "sesion.html");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al cargar la página");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  }

  // Ruta para registrar usuario
  else if (req.url === "/registrar" && req.method === "POST") {
    let cuerpo = "";
    req.on("data", (chunk) => (cuerpo += chunk));
    req.on("end", () => {
      const datos = JSON.parse(cuerpo);
      const { nombre, correo, contrasena } = datos;

      const sql =
        "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)";
      conexion.query(sql, [nombre, correo, contrasena], (err, result) => {
        if (err) {
          res.writeHead(500);
          res.end("Error al registrar");
        } else {
          res.writeHead(200);
          res.end("Usuario registrado correctamente");
        }
      });
    });
  }

  // Servir script.js
  else if (req.url === "/ini-reg/script.js" && req.method === "GET") {
    const filePath = path.join(__dirname, "ini-reg", "script.js");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("JS no encontrado");
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404);
    res.end("Ruta no encontrada");
  }
});

server.listen(3304, () => {
  console.log("Servidor corriendo en http://localhost:3304");
});
