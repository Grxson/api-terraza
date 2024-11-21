import express from 'express'
import Customers from '../models/Customers.js'
import { registerCustomer, loginCustomer, getCsrfToken, profileCustomer, updateCustomer, deleteCustomer } from '../controllers/customersController.js';
import { csrfProtection } from '../middleware/csrf.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/multer.js';

const route = express.Router();

// Ruta para obtener el token CSRF
// route.get('/csrf-token', csrfProtection, getCsrfToken);
route.post('/register', registerCustomer)

route.post('/login', loginCustomer);

// Proteger la ruta de detalles del perfil
route.get('/profile', protegerRuta, profileCustomer);

route.put('/update-customer/:id', upload.single('imagen'), updateCustomer);
route.delete('/delete/:id', deleteCustomer)


export default route;