import Orders from "../models/Orders.js";
import OrderDetail from "../models/OrderDetails.js";


const createOrder = async (req, res) => {
    try {
        const { total, status, productos } = req.body; // Asume que 'productos' es un array de objetos con producto_id y cantidad

        // Crear una nueva instancia de la orden
        const newOrder = new Orders({
            total,
            fecha: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
            status,
        });

        // Guardar la nueva orden en la base de datos
        const savedOrder = await newOrder.save();

        // Crear detalles de la orden
        const orderDetailsPromises = productos.map(async (item) => {
            const orderDetail = new OrderDetail({
                orden_id: savedOrder._id,
                producto_id: item.producto_id,
                cantidad: item.cantidad,
            });
            return orderDetail.save(); // Guarda cada detalle
        });

        // Espera a que todos los detalles se guarden
        await Promise.all(orderDetailsPromises);

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error al crear la orden: ", error);
        res.status(400).json({ message: "Error al crear la orden", error: error.message });
    }
}
const getOrders = async (req, res) => {
    try {
        const orders = await Orders.find();
        res.json(orders);
    } catch (error) {
        console.error("Error al obtener las ordenes: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
        console.log(error);
    }

}
const getOrderById = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }
        res.json(order);
    } catch (error) {
        console.error("Error al obtener esa orden: ", error);
        res.status(500).json({ menssage: "Error interno del servidor" });
    }
}
// Controlador para obtener detalles de una orden específica
const getOrderDetailsByOrderId = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find({ orden_id: req.params.id }).populate("producto_id");

        if (orderDetails.length === 0) {
            return res.status(404).json({ message: "No se encontraron detalles para esta orden" });
        }

        res.json(orderDetails);
    } catch (error) {
        console.error("Error al obtener los detalles de la orden:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

const getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params; // Obtiene el estado de la solicitud

        // Verifica si el estado es válido
        if (!["Pendiente", "Listo", "Cancelado"].includes(status)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        const orders = await Orders.find({ status }); // Filtra las órdenes por estado
        res.json(orders);
    } catch (error) {
        console.error("Error al obtener órdenes por estado:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
    console.log('hola')
};


export {
    createOrder,
    getOrders,
    getOrderById,
    getOrderDetailsByOrderId,
    getOrdersByStatus
}