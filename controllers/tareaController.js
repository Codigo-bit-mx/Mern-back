const Tarea = require('../models/Tarea');
const proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const Proyecto = require('../models/Proyecto');
const { obtenerProyectos } = require('./proyectoController');

//crear la tarea
exports.crearTarea = async (req, res) => {

    //validacion solo para datos que se envian (post) 
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // const {proyecto} = req.body;

    try{
        const {proyecto} = req.body;
        //verificacion que el proyecto exista
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(401).json({msg:'no se encontro el proyecto'})
        }
        //revisar si el proyecto pertenece al usuario autenticado 
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'no autorizado'});
        }

        //Creamos la tarea 
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
        

    }catch(error){
        console.log(error);
        res.status(404).send('hubo un error');
    }
}

//obtiene las tareas por proyecto 

exports.obtenerTareas = async (req, res) => {

     try{
        const {proyecto} = req.query; //se usa query cuando pasas parametros
         //verificacion que el proyecto exista
         const existeProyecto = await Proyecto.findById(proyecto);
         if(!existeProyecto){
             return res.status(401).json({msg:'no se encontro el proyecto'})
         }
 
         //revisar si el proyecto pertenece al usuario autenticado 
         if(existeProyecto.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'no autorizado'});
         }
         //obtener las tareas del proyecto 
         const tareas = await Tarea.find({ proyecto });
         res.json({ tareas })

     }catch(error){
         console.log(error);
         res.status(500).send('hubo un error');
     }
} 

//actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const {proyecto, nombre, estado} = req.body;

        //verificar si la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id); //id que se manda en la peticion 
        if(!tareaExiste){
            return res.status(404).json({msg: 'la tarea no existe'});
        }
        //verificacion que el proyecto exista
        const existeProyecto = await Proyecto.findById(proyecto);
        //revisar si el proyecto pertenece al usuario autenticado 
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'no autorizado'});
        }
        //Crear un objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        //guardar la actualizacion 
        tareaExiste = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, { new: true});
        res.json({tareaExiste});

    } catch (error) {
        res.status(400).send({msg: "error en este endpoint"})
    }
}

//eliminar una tarea 

exports.eliminarTarea = async (req, res) => {
     
    try {

        const {proyecto} = req.query;

        //verificar si la tarea existe
        let tareaExiste = await Tarea.findById(req.params.id); //id que se manda en la peticion 
        if(!tareaExiste){
            return res.status(404).json({msg: 'La tarea no existe'});
        }
        //verificacion que el proyecto exista
        const existeProyecto = await Proyecto.findById(proyecto);
        //revisar si el proyecto pertenece al usuario autenticado 
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //eliminar
        await Tarea.findOneAndDelete({_id: req.params.id});
        res.json({ msg: 'Tarea Eliminada'});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
    }
}