import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import products from "./routes/productsRoutes.js"; // Importa las rutas
import orders from "./routes/ordersRoutes.js"; // Importa las rutas
import orderDetails from "./routes/orderDetailsRoutes.js"; // Importa las rutas
import employeeRoutes from "./routes/employeeRoutes.js";
import temperature from "./routes/temperatureRoutes.js";
import customers from "./routes/customersRoutes.js";

dotenv.config();

const app = express();

// Middleware para manejar JSON correctamente
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Servir la carpeta de uploads como estática
app.use("/uploads", express.static("uploads"));

// Rutas products
app.use("/api/products", products);
// Rutas orders
app.use("/api/orders", orders);
// Rutas Order_details
app.use("/api/order-details", orderDetails);
// Rutas Employees
app.use("/api/employees", employeeRoutes);
// Rutas Customers
app.use("/api/customers", customers);
// Rutas Temperature
app.use("/api/temperature", temperature);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
