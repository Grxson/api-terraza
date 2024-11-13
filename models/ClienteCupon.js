import mongoose, { version } from "mongoose";

const ClienteCuponSchema = new mongoose.Schema({
    cliente_id: {
        type: String,
        ref: 'Customers',
        require: true
    },
    cupon_id: {
        type: String,
        ref: 'Cupones',
        require: true
    },
    status: { 
        type: String, 
        require: true, 
        enum: ['activo'], 
        default: 'activo' 
    },
   
},  {
        versionKey: false
    }
)

const ClienteCupon = mongoose.model('customer_coupons', ClienteCuponSchema);

export default ClienteCupon