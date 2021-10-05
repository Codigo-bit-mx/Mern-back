// rutas para autenticar usuario
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const { check } = require('express-validator');

//Iniciar sesion
//api/auth
router.post('/', 
    // ya se esta realizando en react [
    //     check('email', 'Agregar un email valido').isEmail(),
    //     check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    // ],

    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;