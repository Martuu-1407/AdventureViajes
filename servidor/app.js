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
          return;
        }
        if (resultados.length > 0) {
          console.log("Inicio de sesión exitoso para:", email);
          // 🔴 Guardamos el email como cookie y redirigimos
          res.writeHead(302, {
            "Set-Cookie": `usuario_email=${email}; HttpOnly`,
            Location: "/ini-reg/sesion.html",
          });
          res.end();
          return;
        } else {
          console.log("Credenciales inválidas");
          res.writeHead(401, { "Content-Type": "text/plain" });
          res.end("Credenciales incorrectas");
          return;
        }
      });
    });
    return; // <--- También retorna aquí para que no siga a servir archivos estáticos
  } else if (req.method === "GET" && req.url === "/obtener-nombre") {
    const cookie = req.headers.cookie;
    const email = cookie?.split("usuario_email=")[1]?.split(";")[0];

    if (!email) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("No autorizado");
      return;
    }

    const sql = "SELECT nombre FROM usuarios WHERE email = ?";
    conexion.query(sql, [email], (err, resultados) => {
      if (err || resultados.length === 0) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Usuario no encontrado");
        return;
      }

      const nombre = resultados[0].nombre;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ nombre }));
    });
  } else if (req.method === "POST" && req.url === "/guardar-vuelo") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const datos = JSON.parse(body);

      let horaCorrecta = datos.hora;
      if (horaCorrecta && horaCorrecta.length === 5) {
        horaCorrecta += ":00"; // añade segundos si falta
      }

      const sql = `INSERT INTO vuelos (origen, destino, fecha, hora, precio) VALUES (?, ?, ?, ?, ?)`;
      conexion.query(
        sql,
        [datos.origen, datos.destino, datos.fecha, horaCorrecta, datos.precio],
        (err, resultado) => {
          if (err) {
            console.error("Error al guardar vuelo:", err);
            res.writeHead(500);
            res.end("Error al guardar vuelo");
          } else {
            res.writeHead(200);
            res.end("Vuelo guardado con éxito");
          }
        }
      );
    });
  } else if (req.method === "GET" && req.url === "/obtener-vuelos") {
    const sql = "SELECT * FROM vuelos"; // 👈 esto debe incluir la columna `hora`
    conexion.query(sql, (err, resultados) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al obtener vuelos");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resultados));
      }
    });
  } else if (req.method === "POST" && req.url === "/borrar-vuelo") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const datos = JSON.parse(body);
      const id = datos.id_vuelos; // 👈 usar id_vuelos

      if (!id) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("ID no proporcionado");
        return;
      }

      const sql = "DELETE FROM vuelos WHERE id_vuelos = ?";
      conexion.query(sql, [id], (err, resultado) => {
        if (err) {
          console.error("Error al borrar vuelo:", err);
          res.writeHead(500);
          res.end("Error al borrar vuelo");
          return;
        }

        res.writeHead(200);
        res.end("Vuelo eliminado");
      });
    });
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
