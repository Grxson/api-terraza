import mongoose from "mongoose";

const ClienteCuponSchema = new mongoose.Schema({
    cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers',
        require: true
    },
    cupon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cupones',
        require: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        enum: ['canjeado', 'activo', 'expirado'],
        default: 'activo'
    }
})

const ClienteCupon = mongoose.model('ClienteCupon', ClienteCuponSchema);

export default ClienteCupon