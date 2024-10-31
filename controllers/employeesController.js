import Employee from "../models/Employee.js";
import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'

const createEmployee = async (req, res) => {
    try {
        const { nombre, apellidoP, apellidoM, email, telefono, password, rol } = req.body;

        // Verificar si el empleado existe
        const existingEmployee = await Employee.findOne({ email })
        if (existingEmployee) {
            return res.status(400).json({ error: 'El Empleado ya existe con este email' })
        }

        // Verificar que la contraseña no esté vacía
        if (!password) {
            return res.status(400).json({ message: "La contraseña es requerida." });
        }
        //hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Crear el nuevo empleado
        const newEmployee = new Employee({
            nombre,
            apellidoP,
            apellidoM,
            email,
            telefono,
            password: hashedPassword, // Guardar contraseña hasheada
            rol,
        });
        // Guardar el empleado en la base de datos
        await newEmployee.save();
        res.status(201).json(newEmployee);

    } catch (error) {
        console.error("Error al crear el empleado:", error);
        res.status(400).json({ error: error.message });
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
        res.json(employees)
    } catch (error) {
        console.error('Errpr al obetener los empleados:', error)
        res.status(400).json({ error: error.message })
    }
}
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
        if (!employee) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        res.json(employee)
    } catch (error) {
        console.error('Errpr al obetener al empleado:', error)
        res.status(400).json({ error: error.message })
    }
}
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellidoP, apellidoM, email, telefono, password, rol } = req.body

        const employee = await Employee.findById(id)
        if (!employee) {
            return res.status(404).json({ message: "Empleado no encontrado" })
        }

        // Si se proporciona una nueva contraseña, hashearla
        const updatedPassword = password ? await bcrypt.hash(password, 10) : employee.password;

        // Actualizar al empleado
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                nombre,
                apellidoP,
                apellidoM,
                email,
                telefono,
                password: updatedPassword,
                rol
            },
            { new: true }
        )

        // Hacer mensaje de ok
        res.json(updatedEmployee);

    } catch (error) {
        console.error('Error al actualizar el empleado: ', error)
        res.status(500).json({ message: "Error interno del servidor" })
    }
}
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params

        const deletedEmployee = await Employee.findByIdAndDelete(id)
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        res.json({ message: "Empleado eliminado correctamente" });

    } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}
export {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,

}