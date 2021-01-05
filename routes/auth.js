const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

//Iniciar sesion
router.post('/', authController.autenticarUsuario);

//Obtiene el usuaruo autenticado
router.get('/', auth, authController.usuarioAutenticado);

module.exports = router;