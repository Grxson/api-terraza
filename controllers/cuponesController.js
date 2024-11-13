import Coupons from '../models/Cupones.js'


export const getCupones = async (req, res) => {
    try {
        const cupones = await Coupons.find()
        res.status(200).json(cupones)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cupones.', error });
    }
}
