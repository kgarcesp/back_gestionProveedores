import express from "express";
import cors from "cors";
import priceListRoutes from "./microprojects/priceList/interfaces/routes/routerPriceList";
import routerAuth from "./microprojects/auth/interfaces/routes/routerAuth";

const app = express();

// ✅ Configuración de CORS
app.use(
  cors({
    origin: "*", // mientras pruebas
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-token"],
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Rutas
app.use("/api/price-lists", priceListRoutes);
app.use("/api/auth", routerAuth);

// ✅ Exportas SOLO la app (sin listen)
export default app;
