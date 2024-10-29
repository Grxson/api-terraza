import express from 'express'
import Customers from '../models/Customers.js'

const route = express.Router();

route.get('/', async (req, res) => {
    try {
        const customers = await Customers.find();
        res.json(customers)
    } catch (error) {
        console.error('Error al obetener los Customers')
        res.status(500).json({ message: 'Error interno del servidor'})
    }
    
})


export default route;