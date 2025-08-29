import app from "./app";
import https from "https";
import http from "http";
import fs from "fs";

const PORT = process.env.PORT || 3003;

// Verificamos si existen certificados para levantar HTTPS
let server;
if (fs.existsSync("qa.tierragro.com.key") && fs.existsSync("qa.tierragro.com.crt")) {
  const options = {
    key: fs.readFileSync("qa.tierragro.com.key"),
    cert: fs.readFileSync("qa.tierragro.com.crt"),
    ca: fs.readFileSync("qa.intermediate.crt"),
  };

  server = https.createServer(options, app);
  server.listen(3003, "0.0.0.0", () => {
    console.log(`✅ Servidor HTTPS escuchando en https://0.0.0.0:${PORT}`);
  });
} else {
  // fallback a HTTP (local/dev)
  server = http.createServer(app);
  server.listen(3003, "0.0.0.0", () => {
    console.log(`✅ Servidor HTTP escuchando en http://0.0.0.0:${PORT}`);
  });
}
