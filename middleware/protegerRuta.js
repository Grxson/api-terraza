import jwt, { decode } from 'jsonwebtoken'
import Customers from '../models/Customers.js'

const protegerRuta = async (req, res, next) => {

    const { _token } = req.cookies;
    console.log(_token)
    if (!_token) {
        return res.status(401).json({ message: 'Acceso denegado. Inicia sesión.' });
    }
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        req.id = decoded.id;
        return next()
    } catch (error) {
        console.error(error)
        res.clearCookie('_token').redirect('http://localhost:3000/login')
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
}


export default protegerRuta