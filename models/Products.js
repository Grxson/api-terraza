// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  precio: { type: Number, required: true },
  status: { type: String, default: "Disponible" },
  tipo: {
    type: String,
    required: true,
    enum: ["platillo", "bebida", "deProveedor"],
  },
  valorPuntos: Number,
  descripcion: { type: String, require: true },
  imagen: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
