import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import Customers from "../models/Customers.js";
import fs from 'fs'
import { generarJWT } from "../helpers/tokens.js";

// Ruta para obtener el token CSRF
export const getCsrfToken = (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
};



// Generar un identificador único de 4 letras y 4 números
function generarUserIdentifier() {
    const letras = Math.random().toString(36).substring(2, 6).toUpperCase();
    const numeros = Math.floor(1000 + Math.random() * 9000); // Genera un número de 4 dígitos
    return `${letras}${numeros}`;
}

// Verificar que el identificador sea único en la base de datos
async function generarIdentificadorUnico() {
    let userIdentifier;
    let existe = true;

    while (existe) {
        userIdentifier = generarUserIdentifier();
        const existingCustomer = await Customers.findOne({ userIdentifier });
        existe = !!existingCustomer;
    }

    return userIdentifier;
}
// Crear nuevo cliente
const registerCustomer = async (req, res) => {
    const { nombre, apellidoP, apellidoM, correo, pass } = req.body;

    // Validar si el cliente existe
    const existinggCustomer = await Customers.findOne({ correo })
    if (existinggCustomer) {
        return res.status(400).json({ message: 'Ya existe una cuenta con este correo.' })
    }

    // crear idenficador del usuario
    const userIdentifier = await generarIdentificadorUnico();

    // Crear un nuevo cliente
    const hashedPassword = await bcrypt.hash(pass, 10)
    const newCustomer = new Customers({
        nombre,
        apellidoP,
        apellidoM,
        correo,
        userIdentifier,
        pass: hashedPassword,
        puntosAcumulados: 0
    })
    console.log(newCustomer)
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
            httpOnly: true,
            secure: true,
        })
        return res.json({ message: 'Inicio de sesión exitoso.', customer });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor. Inténtalo de nuevo más tarde.', error: error.message });
    }
};


const profileCustomer = async (req, res) => {
    try {
        const customer = await Customers.findById(req.id)
        if (!customer) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        const profileData = {
            nombre: customer.nombre,
            apellidoP: customer.apellidoP,
            apellidoM: customer.apellidoM,
            correo: customer.correo,
            identificador: customer.userIdentifier,
            puntos: customer.puntosAcumulados

        }

        res.status(200).json({ profileData })
        console.log(profileData)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener el perfil' })
    }



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
    profileCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,

}