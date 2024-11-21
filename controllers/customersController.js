import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import Customers from "../models/Customers.js";
import fs from 'fs'
import { generarJWT } from "../helpers/tokens.js";
import ClienteCupon from "../models/ClienteCupon.js";
import Cupones from "../models/Cupones.js";
import path from "path";

import { fileURLToPath } from 'url'; // Para convertir la URL en la ruta del archivo
import { dirname } from 'path'; // Para obtener el nombre del directorio

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Ruta para obtener el token CSRF
export const getCsrfToken = (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
};



// Generar un identificador único de 4 letras y 4 números
function generarUserIdentifier() {
    const letras = Math.random().toString(36).substring(2, 5).toUpperCase();
    const numeros = Math.floor(100 + Math.random() * 900); // Genera un número de 4 dígitos
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
        imagen: '',
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

        const token = generarJWT({ id: customer._id, nombre: customer.nombre, userIdentifier: customer.userIdentifier })
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
            id: customer._id,
            nombre: customer.nombre,
            apellidoP: customer.apellidoP,
            apellidoM: customer.apellidoM,
            correo: customer.correo,
            imagen: customer.imagen,
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
const canjearCupon = async (req, res) => {
    const { cliente_id, cupon_id } = req.params;

    try {
        // Paso 1: Obtener el cliente y verificar si tiene puntos suficientes
        const customer = await Customers.findById(cliente_id); // Buscamos el cliente por ID
        if (!customer) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        if (customer.puntosAcumulados <= 0) {
            return res.status(400).json({ message: 'El cliente no tiene puntos acumulados.' });
        }

        // Paso 2: Obtener el cupón por su ID
        const cupon = await Cupones.findById(cupon_id);
        if (!cupon) {
            return res.status(404).json({ message: 'Cupón no encontrado.' });
        }

        // Paso 3: Verificar si el cliente tiene suficientes puntos para canjear el cupón
        if (customer.puntosAcumulados < cupon.costoPuntos) {
            return res.status(400).json({ message: 'No tienes suficientes puntos para canjear este cupón.' });
        }

        // Paso 4: Descontar los puntos del cliente
        customer.puntosAcumulados -= cupon.costoPuntos;
        await customer.save(); // Guardamos el cliente con el nuevo total de puntos

        // Paso 5: Crear la relación Cliente-Cupón
        const nuevoCanje = new ClienteCupon({
            cliente_id: customer.userIdentifier, // Relacionamos con el cliente
            cupon_id: cupon._id // Relacionamos con el cupón
        });
        await nuevoCanje.save(); // Guardamos el canje

        await cupon.save(); // Guardamos el estado actualizado del cupón

        // Paso 7: Responder con éxito
        res.status(200).json({ message: 'Cupón Canjeado con éxito' })
        // res.status(200).json({
        //     message: 'Cupón canjeado con éxito.',
        //     customer: {
        //         id: customer._id,
        //         nombre: customer.nombre,
        //         puntosAcumulados: customer.puntosAcumulados
        //     },
        //     cupon: {
        //         nombre: cupon.nombre,
        //         descuento: cupon.descuento,
        //         descripcion: cupon.descripcion
        //     }
        // });

    } catch (error) {
        res.status(500).json({ message: 'Error al procesar el canje del cupón.', error });
    }
}


const updateCustomer = async (req, res) => {
    const { nombre, apellidoP, apellidoM, correo, pass, imagen } = req.body
    const { id } = req.params

    try {
        // Buscar al customer por el ID
        const customer = await Customers.findById(id)
        if (!customer) {
            return res.status(400).json({ message: 'Cliente no encontrado' })
        }
        // Verificar si el correo ya está en uso por otro cliente (si es que lo están actualizando)
        if (correo && correo !== customer.correo) {
            const existingCustomer = await Customers.findOne({ correo })
            if (existingCustomer) {
                return res.status(400).json({ message: 'Ya existe una cuenta con este correo.' });
            }
        }
        // Si se proporcionó una nueva contraseña, encriptarla antes de actualizar
        if (pass) {
            const hashedPassword = await bcrypt.hash(pass, 10);
            customer.pass = hashedPassword;
        }
        // Actualizar los campos proporcionados
        if (nombre) customer.nombre = nombre;
        if (apellidoP) customer.apellidoP = apellidoP;
        if (apellidoM) customer.apellidoM = apellidoM;
        if (correo) customer.correo = correo;
        // Manejo de la imagen subida

        console.log(req.file)
        // Manejo de la imagen subida
        if (req.file) {
            // Eliminar la imagen anterior si existe
            if (customer.imagen) {
                const previousImagePath = path.join(__dirname, '..', 'uploads', path.basename(customer.imagen));
                if (fs.existsSync(previousImagePath)) {
                    fs.unlinkSync(previousImagePath); // Eliminar la imagen anterior
                }
            }

            // Guardar la nueva imagen
            const baseUrl = process.env.BASE_URL || 'http://localhost:5000'; // Asegúrate de configurar BASE_URL en .env
            const imageUrl = `${baseUrl}/uploads/${req.file.filename}`; // Construye la URL completa
            customer.imagen = imageUrl; // Guarda la URL en la base de datos
        }
        // Guardar los cambios
        await customer.save();

        res.status(200).json({ message: 'Datos actualizados correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Hubo un error al actualizar los datos del cliente' })
    }
}
const deleteCustomer = async (req, res) => {

}
export {
    loginCustomer,
    registerCustomer,
    profileCustomer,
    canjearCupon,
    updateCustomer,
    deleteCustomer,

}