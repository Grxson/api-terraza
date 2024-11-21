import Product from "../models/Products.js";
import fs from 'fs'


const createProduct = async (req, res) => {
    let imagenUrl = "";
    try {
        const { nombre, precio, tipo, descripcion, status = "disponible" } = req.body;

        // Verificar si el nombre del producto ya existe
        const existingProduct = await Product.findOne({ nombre });
        if (existingProduct) {
            if (req.file) {
                fs.unlinkSync(req.file.path); // Elimina la imagen del uploads
            }
            return res.status(400).json({ error: "El Producto ya Existe" });
        }

        // Crear URL completa de la imagen
        if (req.file) {
            imagenUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const newProduct = new Product({
            nombre,
            precio,
            tipo,
            status,
            descripcion,
            imagen: imagenUrl, // Guardar la URL completa de la imagen
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        // Si ocurre un error, elimina la imagen del servidor si se subió
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ error: error.message });

    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
        console.log(products)
        
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
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, tipo, descripcion, status } = req.body;

        // Verificar si el producto existe
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Crear URL completa de la nueva imagen si existe
        let imagenUrl = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : product.imagen; // Mantener la URL anterior si no se proporciona una nueva

        // Actualiza el producto
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { nombre, precio, tipo, status, descripcion, imagen: imagenUrl },
            { new: true } // Retorna el producto actualizado
        );

        // Si se proporciona una nueva imagen, elimina la anterior del servidor
        if (req.file && product.imagen) {
            const imagePath = product.imagen.split('/').pop(); // Obtener el nombre del archivo
            fs.unlinkSync(`uploads/${imagePath}`); // Eliminar el archivo de la carpeta uploads
        }

        res.json(updatedProduct);
    } catch (error) {
        // Si ocurre un error, elimina la imagen del servidor si se subió
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
const deleteProduct = async (req, res) => {

    try {
        const { id } = req.params

        // Verificar si el producto existe
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        // Eliminar la imagen del servidor
        if (product.imagen) {
            const imagePath = product.imagen.split('/').pop(); // Obtener el nombre del archivo
            fs.unlinkSync(`uploads/${imagePath}`); // Eliminar el archivo de la carpeta uploads
        }

        await Product.findByIdAndDelete(id);
        res.json({ message: "Producto eliminado con éxito" });

    } catch (error) {
        console.error('Error al eliminar el producto:', error)
        return res.status(500).json({ message: "Error interno del servidor" })
    }
}

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}