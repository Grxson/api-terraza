import mongoose from "mongoose";

// Definir el esquema para las órdenes
const orderSchema = new mongoose.Schema(
    {
        total: { type: Number, required: true },
        fecha: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["Listo", "En Preparación", "Cancelado"],
            default: "En Preparación"
        },
    },
    { timestamps: true } // Añade automáticamente createdAt y updatedAt
);

// Crear el modelo para la colección "orders"
const Order = mongoose.model("Order", orderSchema, "orders");

export default Order;
