import express from 'express'
 import { getCupones } from '../controllers/cuponesController.js';
import { canjearCupon } from '../controllers/customersController.js';
const router = express.Router()

router.get('/', getCupones);

router.post('/canjear/:cliente_id/:cupon_id', canjearCupon);
console.log('Hola mundo')

export default router;

