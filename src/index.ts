import app from "./app";
import fs from "fs";
import https from "https";
import http from "http";

const PORT = process.env.PORT || 3003;

try {
  const serverOptions = {
    cert: fs.readFileSync("qa.tierragro.com.crt"),
    ca: fs.readFileSync("qa.intermediate.crt"),
    key: fs.readFileSync("qa.tierragro.com.key"),
  };

  https.createServer(serverOptions, app).listen(PORT, () => {
    console.log(`✅ Servidor HTTPS escuchando en https://0.0.0.0:${PORT}`);
  });


} catch (error) {
  console.error("Error iniciando servidor HTTPS:", error);
  // Fallback a HTTP si no hay certificados
  app.listen(PORT, () => {
    console.log(`⚠️ Servidor HTTP escuchando en http://0.0.0.0:${PORT}`);
  });
}
