import express from "express";
import cors from "cors";
import morgan from "morgan";
import priceListRoutes from "./microprojects/priceList/interfaces/routes/routerPriceList";
import routerAuth from "./microprojects/auth/interfaces/routes/routerAuth";


const app = express();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-token"]
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

// Rutas
app.use("/api/price-lists", priceListRoutes);
app.use("/api/auth", routerAuth);

export default app;
