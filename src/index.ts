import app from "./app";
import https from "https";
import http from "http";
import fs from "fs";

const PORT = Number(process.env.PORT) || 3003;
const NODE_ENV = process.env.NODE_ENV || "development";

if (
  NODE_ENV === "production" && // solo en producción usar HTTPS
  fs.existsSync("qa.tierragro.com.key") &&
  fs.existsSync("qa.tierragro.com.crt") &&
  fs.existsSync("qa.intermediate.crt")
) {
  const options = {
    key: fs.readFileSync("qa.tierragro.com.key"),
    cert: fs.readFileSync("qa.tierragro.com.crt"),
    ca: fs.readFileSync("qa.intermediate.crt"),
  };

  https.createServer(options, app).listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor HTTPS escuchando en https://0.0.0.0:${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, "0.0.0.0", () => {
    console.log(`⚠️ Servidor HTTP escuchando en http://0.0.0.0:${PORT}`);
  });
}
