import Product from "../models/Products.js";
import fs from 'fs'

const createProduct = async (req, res) => {
    try {
        const { nombre, precio, tipo, status = "disponible" } = req.body;

        // Verificar si el nombre del producto ya existe
        const existingProduct = await Product.findOne({ nombre });
        if (existingProduct) {
            if (req.file) {
                fs.unlinkSync(req.file.path); // Elimina la imagen del uploads
            }
            return res.status(400).json({ error: "El Producto ya Existe" });
        }

        // Crear URL de la imagen
        const imagenUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newProduct = new Product({
            nombre,
            precio,
            tipo,
            status,
            imagen: imagenUrl,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(product); // Enviar el producto como JSON
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export {
    createProduct,
    getAllProducts,
    getProductById
}