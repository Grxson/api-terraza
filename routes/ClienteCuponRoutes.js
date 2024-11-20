import express from "express";
import { getCuponesDeCliente } from "../controllers/clienteCuponesController.js";

const router = express.Router()

// Ruta para obtener los cupones de un cliente
router.get('/:_id', getCuponesDeCliente);

export default router;