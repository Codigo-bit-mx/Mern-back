const Usuario = require('../models/Usuario');
const bycriptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    
    //revisar si hay errores
     const errores = validationResult(req);
     if( !errores.isEmpty() ){
         return res.status(400).json({errores: errores.array()})
     }

     //extraer el email y password 
     const { email, password } = req.body;

     try {
        //revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }
        
        //revisar que el password sea correcto
        const passwordCorrecto = await bycriptjs.compare(password, usuario.password);
        if(!passwordCorrecto){
            return res.status(400).json({msg: 'El password es incorrecto'});
        }

           //si todo es correcto, crear y firma el JWT
           const payload = {
            usuario: {
                id: usuario.id
            }
        }
           jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            //Mensaje de confirmacion
            res.json({ token });
        });


     } catch (error) {
        console.log(error);
     }

}

exports.usuarioAutenticado = async (req, res) => {

    try{
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({ usuario })
    }catch(error){
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error'});
    }

}