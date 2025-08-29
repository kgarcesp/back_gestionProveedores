import app from "./app";
import https from "https";
import http from "http";
import fs from "fs";

const PORT = process.env.PORT || 3003;

// Si existen los certificados levantamos HTTPS
if (fs.existsSync("qa.tierragro.com.key") && fs.existsSync("qa.tierragro.com.crt") && fs.existsSync("qa.intermediate.crt")) {
    const options = {
        key: fs.readFileSync("qa.tierragro.com.key"),
        cert: fs.readFileSync("qa.tierragro.com.crt"),
        ca: fs.readFileSync("qa.intermediate.crt")
    };

    https.createServer(options, app).listen(3003, "0.0.0.0", () => {
        console.log(`✅ Servidor HTTPS escuchando en https://0.0.0.0:${PORT}`);
    });
} else {
    // Fallback local/dev
    http.createServer(app).listen(3003, "0.0.0.0", () => {
        console.log(`⚠️ Servidor HTTP escuchando en http://0.0.0.0:${PORT}`);
    });
}

