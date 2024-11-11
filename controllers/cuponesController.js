import Cupones from '../models/Cupones.js'


const getCupones = async (req, res) => {
    try {
        const cupones = await Cupones.find()
        res.status(200).json(cupones)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cupones.', error });
    }
}

export {
    getCupones
}