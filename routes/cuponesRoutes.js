import express from 'express'
import { getCupones } from '../controllers/cuponesController.js';
import { canjearCupon } from '../controllers/customersController.js';
import protegerRuta from '../middleware/protegerRuta.js';
const router = express.Router()

router.get('/', protegerRuta, getCupones);

router.post('/canjear/:cliente_id/:cupon_id', canjearCupon);

export default router;

