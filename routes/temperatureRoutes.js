import express from "express";
import { getTemperature } from "../controllers/temperatureController.js";

const router = express.Router();

// Ruta para extraer la temperatura
router.get('/', getTemperature)



export default router;