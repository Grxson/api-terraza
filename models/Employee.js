import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidoP: { type: String, default: '' },
  apellidoM: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  status: { type: String, default: 'Activo' },
  password: { type: String, required: true },
  tipo: { type: String, required: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const Employee = mongoose.model('Employees', employeeSchema, 'employees');

export default Employee;
