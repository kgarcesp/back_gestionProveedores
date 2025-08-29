import app from "./app";
import https from "https";
import fs from "fs";

const PORT = process.env.PORT || 3003;

// Intentamos leer los certificados solo si existen (QA)
let server: any;
try {
  const options = {
    key: fs.readFileSync("qa.tierragro.com.key"),
    cert: fs.readFileSync("qa.tierragro.com.crt"),
    ca: fs.readFileSync("qa.intermediate.crt"),
  };

  server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`Servidor HTTPS escuchando en https://qa.tierragro.com:${PORT}`);
  });
} catch (err) {
  console.warn(" No se encontraron certificados, iniciando en HTTP...");
  app.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en http://localhost:${PORT}`);
  });
}
