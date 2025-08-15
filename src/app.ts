// src/app.ts
import express from "express";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json()); 
// 🔹 Permite que Express pueda leer JSON en las peticiones

// 📂 Carpeta base donde están todos los microproyectos
const routesDir = path.join(__dirname, "microprojects");

/**
 * 📌 Función recursiva que busca y registra automáticamente todas
 *    las rutas de todos los microproyectos.
 *    - Acepta cualquier archivo `.ts` dentro de carpetas llamadas `routes`
 *    - No obliga a que el archivo termine en "Routes.ts"
 */
const registerRoutes = (dir: string) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // 📂 Si es carpeta, seguimos buscando
      registerRoutes(fullPath);
    } 
    // 📄 Solo tomamos archivos `.ts` dentro de carpetas que contengan "routes"
    else if (entry.isFile() && entry.name.endsWith(".ts") && dir.includes("routes")) {
      const routeModule = require(fullPath);
      const router = routeModule.default || routeModule;

      if (router && typeof router === "function") {
        // 🔹 Detectar el nombre del microproyecto para usarlo como parte de la URL
        const parts = fullPath.split(path.sep);
        const projectNameIndex = parts.findIndex((p) => p === "microprojects") + 1;
        const projectName = parts[projectNameIndex] || "";

        // Registrar con el prefijo /api/[nombreMicroproyecto]
        app.use(`/api/${projectName}`, router);

        console.log(`✅ Ruta registrada para microproyecto "${projectName}": ${fullPath}`);
      }
    }
  });
};

// 📌 Llamamos la función para registrar todas las rutas
registerRoutes(routesDir);

export default app;
