import express from "express";
import { getCuponesDeCliente } from "../controllers/clienteCuponesController.js";
import protegerRuta from "../middleware/protegerRuta.js";

const router = express.Router()

// Ruta para obtener los cupones de un cliente
router.get('/:_id', protegerRuta, getCuponesDeCliente);

export default router;