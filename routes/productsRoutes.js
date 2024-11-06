import express from "express";
import upload from "../middleware/multer.js";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import protegerRuta from "../middleware/protegerRuta.js";
const router = express.Router();

// Ruta para crear un producto
router.post("/", upload.single("imagen"), createProduct);

// Ruta para obtener todos los productos
router.get("/", getAllProducts);

// Ruta para obtener un producto por ID
router.get("/:id", getProductById);

// Ruta para actualizar un producto
router.put("/:id", upload.single("imagen"), updateProduct);

// Ruta para eliminar un producto
router.delete("/:id", deleteProduct);

export default router;
