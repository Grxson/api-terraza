import express from "express";
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from '../controllers/employeesController.js';

const route = express.Router();

// Ruta para crear un nuevo empleado
route.post('/', createEmployee);

// Ruta para obtener todos los empleados
route.get('/', getAllEmployees);

// Ruta para obtener un empleado por ID
route.get('/:id', getEmployeeById);

// Ruta para actualizar un empleado
route.put('/:id', updateEmployee);

// Ruta para eliminar un empleado
route.delete('/:id', deleteEmployee);


export default route;