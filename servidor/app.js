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

      // 🔒 Si es el admin, devolvemos JSON con redirección
      if (email === "admin@gmail.com" && contrasena === "123123") {
        res.writeHead(200, {
          "Set-Cookie": `usuario_email=${email}; HttpOnly`,
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ redirect: "/adminn/admin.html" }));
        return;
      }

      // 🔍 Si no es admin, consultamos en la base de datos
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
          res.writeHead(200, {
            "Set-Cookie": `usuario_email=${email}; HttpOnly`,
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify({ redirect: "/vuelos/vuelos.html" }));
        } else {
          console.log("Credenciales inválidas");
          res.writeHead(401, { "Content-Type": "text/plain" });
          res.end("Credenciales incorrectas");
        }
      });
    });

    return;
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

      const sql = `INSERT INTO vuelos (origen, destino, fecha, precio) VALUES (?, ?, ?, ?)`;
      conexion.query(
        sql,
        [datos.origen, datos.destino, datos.fecha, datos.precio],
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
      try {
        console.log("Body recibido:", body); // 👈 AGREGALO
        const datos = JSON.parse(body);
        console.log("Datos parseados:", datos); // 👈 AGREGALO

        const id = Number(datos.id_vuelo);
        console.log("ID parseado:", id); // 👈 AGREGALO

        if (!id || isNaN(id)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ID no proporcionado o inválido");
          return;
        }

        const sql = "DELETE FROM vuelos WHERE id_vuelo = ?";
        conexion.query(sql, [id], (err, resultado) => {
          if (err) {
            console.error("Error al borrar vuelo:", err);
            res.writeHead(500);
            res.end("Error al borrar vuelo");
            return;
          }

          if (resultado.affectedRows === 0) {
            console.log("No se encontró el vuelo con ese ID.");
            res.writeHead(404);
            res.end("Vuelo no encontrado");
            return;
          }

          console.log("Vuelo eliminado correctamente");
          res.writeHead(200);
          res.end("Vuelo eliminado");
        });
      } catch (e) {
        console.error("Error al parsear JSON:", e); // 👈 CLAVE
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "POST" && req.url === "/borrar-paquete") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        const id = Number(datos.id_paquete);

        if (!id || isNaN(id)) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ID no proporcionado o inválido");
          return;
        }

        const sql = "DELETE FROM paquetes WHERE id_paquete = ?";
        conexion.query(sql, [id], (err, resultado) => {
          if (err) {
            console.error("Error al borrar paquete:", err);
            res.writeHead(500);
            res.end("Error al borrar paquete");
            return;
          }

          if (resultado.affectedRows === 0) {
            res.writeHead(404);
            res.end("Paquete no encontrado");
            return;
          }

          console.log("Paquete eliminado correctamente");
          res.writeHead(200);
          res.end("Paquete eliminado");
        });
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "POST" && req.url === "/guardar-auto") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        const sql = `INSERT INTO autos (modelo, ciudad, plazas, precio_dia) VALUES (?, ?, ?, ?)`;
        conexion.query(
          sql,
          [datos.modelo, datos.ciudad, datos.plazas, datos.precio_dia],
          (err, resultado) => {
            if (err) {
              console.error("Error al guardar auto:", err);
              res.writeHead(500);
              res.end("Error al guardar auto");
            } else {
              res.writeHead(200);
              res.end("Auto guardado con éxito");
            }
          }
        );
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "POST" && req.url === "/guardar-paquete") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        console.log("Datos recibidos para guardar paquete:", datos);

        const sql = `INSERT INTO paquetes (destino, fecha, pasajeros, precio) VALUES (?, ?, ?, ?)`;
        conexion.query(
          sql,
          [datos.destino, datos.fecha, datos.pasajeros, datos.precioTotal], // o cambia precioTotal a precio si quieres
          (err, resultado) => {
            if (err) {
              console.error("Error al guardar paquete:", err);
              res.writeHead(500);
              res.end("Error al guardar paquete");
            } else {
              res.writeHead(200);
              res.end("Paquete guardado con éxito");
            }
          }
        );
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
    });
  } else if (req.method === "GET" && req.url === "/obtener-autos") {
    const sql = "SELECT * FROM autos";
    conexion.query(sql, (err, resultados) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al obtener autos");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resultados));
      }
    });
  } else if (req.method === "GET" && req.url === "/obtener-paquetes") {
    const sql = "SELECT * FROM paquetes";
    conexion.query(sql, (err, resultados) => {
      if (err) {
        res.writeHead(500);
        res.end("Error al obtener paquetes");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resultados));
      }
    });
  } else if (req.method === "POST" && req.url === "/borrar-auto") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const datos = JSON.parse(body);
        const id = Number(datos.id_auto);
        if (!id || isNaN(id)) {
          res.writeHead(400);
          res.end("ID no válido");
          return;
        }
        const sql = "DELETE FROM autos WHERE id_auto = ?";
        conexion.query(sql, [id], (err, resultado) => {
          if (err) {
            console.error("Error al borrar auto:", err);
            res.writeHead(500);
            res.end("Error al borrar auto");
            return;
          }
          if (resultado.affectedRows === 0) {
            res.writeHead(404);
            res.end("Auto no encontrado");
            return;
          }
          res.writeHead(200);
          res.end("Auto eliminado");
        });
      } catch (e) {
        console.error("Error al parsear JSON:", e);
        res.writeHead(400);
        res.end("Error en el cuerpo de la solicitud");
      }
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
