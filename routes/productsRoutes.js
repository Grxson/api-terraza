import express from "express";
import upload from "../middleware/multer.js";
import { createProduct, getAllProducts, getProductById } from "../controllers/productController.js";
const router = express.Router();

// Ruta para crear un producto
router.post("/", upload.single("imagen"), createProduct);

// Ruta para obtener todos los productos
router.get("/", getAllProducts);

// Ruta para obtener un producto por ID
router.get("/:id", getProductById);

export default router;
