import express from 'express'
import Customers from '../models/Customers.js'
import { registerCustomer, loginCustomer, getCsrfToken } from '../controllers/customersController.js';
import { csrfProtection } from '../middleware/csrf.js';

const route = express.Router();

// Ruta para obtener el token CSRF
// route.get('/csrf-token', csrfProtection, getCsrfToken);
route.post('/register', registerCustomer)

route.post('/login', loginCustomer);



export default route;