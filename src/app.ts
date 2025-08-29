import express from "express";
import cors from "cors";
import priceListRoutes from "./microprojects/priceList/interfaces/routes/routerPriceList";
import routerAuth from "./microprojects/auth/interfaces/routes/routerAuth";

const app = express();

app.use(cors({
  origin: "*", // cualquier origen mientras pruebas
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/price-lists", priceListRoutes);
app.use("/api/auth", routerAuth);

export default app;
