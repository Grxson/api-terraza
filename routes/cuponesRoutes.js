import express from 'express'
import { getCupones } from '../controllers/cuponesController.json'
const router = express.Router()

router.get('/', getCupones);

module.exports = router;

