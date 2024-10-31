import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidoP: { type: String },
  apellidoM: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  status: { type: String, default: 'Activo' },
  password: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    enum: ['admin', 'empleado'],
    default: 'empleado'
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Employee = mongoose.model('Employees', employeeSchema, 'employees');

export default Employee;
