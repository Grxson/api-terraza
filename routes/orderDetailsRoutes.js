import express from 'express';
import OrderDetail from '../models/OrderDetails.js'; 

const router = express.Router();

// Ruta para obtener todos los detalles de las órdenes
router.get('/', async (req, res) => {
  try {
    const orderDetails = await OrderDetail.find(); // Acceder a la colección "order_details"
    res.json(orderDetails);
  } catch (error) {
    console.error('Error al obtener detalles de órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


export default router;
