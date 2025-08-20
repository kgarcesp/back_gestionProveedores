import express from "express";
import cors from "cors";
import priceListRoutes from "../src/microprojects/priceList/interfaces/routes/routerPriceList";

const app = express();

// ✅ Configuración de CORS
app.use(cors({
  origin: "https://integraciones.tierragro.com", // frontend prod
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// ✅ Middleware para JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Montar rutas
app.use("/api/priceList", priceListRoutes);

export default app;
