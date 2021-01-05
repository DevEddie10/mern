const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //Leer el token del header
    const token = req.header('x-auth-token');

    //Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No se ha enviado el token' });
    }

    //Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET);
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no valido' });
    }
}