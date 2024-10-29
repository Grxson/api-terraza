import express from "express";
import Employee from "../models/Employee.js";

const route = express.Router();

route.get('/', async (req, res) => {
    try {
        const employees = await Employee.find()
        res.json(employees)
    } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
    }
})

export default route;