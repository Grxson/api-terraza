import Customers from '../models/Customers.js'; // Modelo de clientes
import customer_coupons from '../models/ClienteCupon.js'; // Modelo de cupones por cliente
import Cupones from '../models/Cupones.js'; // Modelo de cupones

const getCuponesDeCliente = async (req, res) => {
    const { _id } = req.params; // ID del cliente recibido en la ruta

    try {
        // Verificar si el cliente existe usando su _id
        const cliente = await Customers.findById(_id);
        if (!cliente) {
            return res.status(404).json({ message: 'El cliente no existe.' });
        }

        // Obtener el userIdentifier del cliente
        const { userIdentifier } = cliente;

        // Buscar los cupones asociados al userIdentifier en customer_coupons con status "activo"
        const clienteCupones = await customer_coupons.find({ cliente_id: userIdentifier, status: "activo" });

        // Si no se encuentran cupones, retornar un 404
        if (clienteCupones.length === 0) {
            return res.status(404).json({ message: 'Este cliente no tiene cupones activos asignados.' });
        }

        // Obtener los IDs de los cupones
        const cuponesIds = clienteCupones.map(cupon => cupon.cupon_id);

        // Buscar los detalles de los cupones en la colección Cupones
        const cupones = await Cupones.find(
            { _id: { $in: cuponesIds } },
            'nombre descuento descripcion costoPuntos'
        );

        // Retornar directamente los detalles de los cupones encontrados
        res.status(200).json({ cupones });
    } catch (error) {
        console.error('Error al obtener los cupones del cliente:', error);
        res.status(500).json({ message: 'Error al obtener los cupones del cliente.', error });
    }
};


export { getCuponesDeCliente };
