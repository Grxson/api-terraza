import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import Customers from "../models/Customers.js";
import fs from 'fs'
import { generarJWT } from "../helpers/tokens.js";

// Ruta para obtener el token CSRF
export const getCsrfToken = (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
};
// Crear nuevo cliente
const registerCustomer = async (req, res) => {
    const { nombre, apellidoP, apellidoM, correo, pass } = req.body;

    // Validar si el cliente existe:
    const existinggCustomer = await Customers.findOne({ correo })
    if (existinggCustomer) {
        return res.status(400).json({ message: 'Ya existe una cuenta con este correo.' })
    }

    // Crear un nuevo cliente
    const hashedPassword = await bcrypt.hash(pass, 10)
    const newCustomer = new Customers({
        nombre,
        apellidoP,
        apellidoM,
        correo,
        pass: hashedPassword,
    })

    try {
        await newCustomer.save();
        res.status(201).json({ message: 'Se ha creado tu cuenta con éxito.' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo algún error al registrarte.', error });
    }

}
const loginCustomer = async (req, res) => {
    try {
        const { correo, pass } = req.body;

        // Verificar que se hayan proporcionado los datos requeridos
        if (!correo || !pass) {
            return res.status(400).json({ message: 'Se requieren correo y contraseña.' });
        }

        // Buscar el cliente en la base de datos
        const customer = await Customers.findOne({ correo });
        if (!customer) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(pass, customer.pass);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        const token = generarJWT({ id: customer._id, nombre: customer.nombre })
        console.log(token)

        res.cookie('_token', token, {
            httpOnly: true
        })
        return res.json({ message: 'Inicio de sesión exitoso.', customer });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor. Inténtalo de nuevo más tarde.' });
    }
};


const getAllCustomers = async (req, res) => {

}
const getCustomerById = async (req, res) => {

}
const updateCustomer = async (req, res) => {

}
const deleteCustomer = async (req, res) => {

}
export {
    loginCustomer,
    registerCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,

}