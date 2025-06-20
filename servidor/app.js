const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const conexion = require("./db/conexion");

// MIME types
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/registrar") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const datos = querystring.parse(body);
      const nombre = datos.nombre;
      const email = datos.email;
      const contrasena = datos.contrasena;

      const sql =
        "INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)";
      conexion.query(sql, [nombre, email, contrasena], (err, resultado) => {
        if (err) {
          console.error("Error al insertar datos:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error al registrar");
        } else {
          console.log("Usuario registrado con éxito");
          res.writeHead(302, { Location: "/" }); // redirige a inicio
          res.end();
        }
      });
    });
  } else if (req.method === "POST" && req.url === "/login") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const datos = querystring.parse(body);
      const email = datos.email;
      const contrasena = datos.contrasena;

      const sql = "SELECT * FROM usuarios WHERE email = ? AND contrasena = ?";
      conexion.query(sql, [email, contrasena], (err, resultados) => {
        if (err) {
          console.error("Error al buscar usuario:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error interno del servidor");
          return; // <--- Asegurate de retornar para no seguir ejecutando
        }
        if (resultados.length > 0) {
          console.log("Inicio de sesión exitoso para:", email);
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("ok");
          return; // <--- Importante
        } else {
          console.log("Credenciales inválidas");
          res.writeHead(401, { "Content-Type": "text/plain" });
          res.end("Credenciales incorrectas");
          return; // <--- Importante
        }
      });
    });
    return; // <--- También retorna aquí para que no siga a servir archivos estáticos
  } else {
    // Servir archivos estáticos para GET y otras solicitudes
    let filePath = path.join(
      __dirname,
      "..",
      "cliente",
      req.url === "/" ? "ini-reg/sesion.html" : req.url
    );
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "text/plain";

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Archivo no encontrado");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
  }
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
