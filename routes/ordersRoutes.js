import express from "express";
import { createOrder, getOrders, getOrderById, getOrderDetailsByOrderId, getOrdersByStatus } from "../controllers/orderController.js";


const router = express.Router();

// Endpoint para crear una nueva orden
router.post("/", createOrder);

// Endpoint para obtener todas las órdenes
router.get("/", getOrders);

// Endpoint para obtener una orden por ID
router.get("/:id", getOrderById);

// Ruta para obtener los detalles de una orden específica
router.get("/:id/details", getOrderDetailsByOrderId);
// Ruta para obtener órdenes por estado
router.get("/status/:status", getOrdersByStatus);

export default router;
