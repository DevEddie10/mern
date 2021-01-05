const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //extraer el email y password
    const { email, password } = req.body;

    try {
        //Revisar que sea usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        //Revisar el password
        const passCorrecto = await bcrypt.compare(password, usuario.password);
        
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'password incorrecto' });
        }

        //Si todo es correcto, crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmacion
            res.json({ token });
        });
    } catch (error) {
        console.log(error);
    }
}

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error'
        });
    }
}