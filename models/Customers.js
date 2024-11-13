import mongoose from "mongoose";

const customersSchema = new mongoose.Schema({
    // _id: { type: Number, require: true },
    nombre: { type: String, require: true },
    apellidoP: { type: String, require: true },
    apellidoM: { type: String, require: true },
    correo: { type: String, require: true, unique: true },
    pass: { type: String, require: true },
    token: { type: String },
    google_id: { type: String },
    imagen: { type: String },
    userIdentifier: { type: String, unique: true, required: true },
    puntosAcumulados: { type: Number, default: 0 }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['pass', 'token', 'confirmado', 'createdAt', 'updatedAt'],
            }
        }
    }
})

const Customers = mongoose.model('Customers', customersSchema, 'customers')
customersSchema.methods.verificarPassword = function (pass) {
    return bcrypt.compareSync(pass, this.pass);
};


export default Customers;