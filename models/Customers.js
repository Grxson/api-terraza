import mongoose from "mongoose";

const customersSchema = new mongoose.Schema({
    _id: {type: Number, require: true},
    nombre: {type: String, require: true},
    apellidoP: {type: String, require: true},
    apellidoM: {type: String, require: true},
    correo: {type: String, require: true, unique: true},
    pass: {type: String, require: true},
    google_id: {type: String, require: true},
    imagen: {type: String, require: true},
}, {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },})

const Customers = mongoose.model('Customers', customersSchema, 'customers')

export default Customers;