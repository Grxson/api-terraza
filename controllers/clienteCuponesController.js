import customer_coupons from '../models/ClienteCupon.js';
import Cupones from '../models/Cupones.js';

const getCuponesDeCliente = async (req, res) => {
    // Uso el userIdentifier por el momento
    const { cliente_id } = req.params;

    try {
        // Encuentra todos los cupones asociados a este cliente usando cliente_id
        const clienteCupones = await customer_coupons.find({ cliente_id });

        // Si no hay cupones para este cliente, retornar un 404
        if (clienteCupones.length === 0) {
            return res.status(404).json({ message: 'Este cliente no tiene cupones asignados.' });
        }

        // Realizar la búsqueda manual de detalles de cada cupón usando los IDs de cupones obtenidos
        const cuponesIds = clienteCupones.map(cupon => cupon.cupon_id);
        const detallesCupones = await Cupones.find({ _id: { $in: cuponesIds } }, 'nombre descuento status descripcion costoPuntos');

        // Combina los detalles del cupón con la información almacenada en clienteCupones
        const respuesta = clienteCupones.map(cupon => {
            const detalles = detallesCupones.find(detalle => detalle._id.toString() === cupon.cupon_id);
            return {
                ...cupon.toObject(),
                detallesCupon: detalles || null
            };
        });

        // Retornar los cupones asociados al cliente con sus detalles
        res.status(200).json({ cupones: respuesta });
    } catch (error) {
        console.error('Error al obtener los cupones del cliente:', error);
        res.status(500).json({ message: 'Error al obtener los cupones del cliente.', error });
    }
};

export {
    getCuponesDeCliente
};
