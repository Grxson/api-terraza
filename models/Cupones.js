import mongoose from "mongoose";
const CouponsSchema = new mongoose.Schema({
    nombre: { type: String, require: true },
    descuento: { type: Number, require: true },
    status: { type: String, require: true, enum: ['disponible', 'no disponible'], default: 'disponible' },
    descripcion: { type: String, require: true },
    costoPuntos: { type: Number, require: true },
})

const Cupones = mongoose.model('Coupons', CouponsSchema)

export default Cupones;