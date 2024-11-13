import customer_coupons from '../models/ClienteCupon.js'
import Cupones from '../models/Cupones.js'

const getCuponesDeCliente = async (req, res) => {
    const { cliente_id } = req.params;
    try {
        const clienteCupones = await customer_coupons.find({ cliente_id })
            .populate('cupon_id', 'nombre descuento status descripcion costoPuntos') // Traer detalles del cupon
            .exec();

        if (clienteCupones.length === 0) {
            return res.status(404).json({ message: 'Este cliente no tiene cupones asignados.' });
        }
        res.status(200).json(clienteCupones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cupones del cliente.', error });
    }
}

export {
    getCuponesDeCliente
}