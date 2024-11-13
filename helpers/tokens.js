import jwt from 'jsonwebtoken'

const generarJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre, userIdentifier: datos.userIdentifier }, process.env.JWT_SECRET, { expiresIn: '1d' })


export {
    generarJWT
}