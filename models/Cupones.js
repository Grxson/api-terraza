import mongoose from "mongoose";
const CuponesSchema = new mongoose.Schema({
    nombre: { type: String, require: true },
    descuento: { type: Number, require: true },
    status: { type: String, require: true, enum: ['activo', 'inactivo'], default: 'activo' },
    descripcion: { type: String, require: true },
    costoPuntos: { type: Number, require: true },
})

const Cupones = mongoose.model('Cupones', CuponesSchema)

export default Cupones;