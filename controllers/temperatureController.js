import Temperature from "../models/Temperatures.js";


const getTemperature = async (req, res) => {
    try {
        const temperature = await Temperature.find();
        res.json(temperature)
    } catch (error) {
        console.error('Error al obtener los detalles de la temperatura')
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

export {
    getTemperature
}