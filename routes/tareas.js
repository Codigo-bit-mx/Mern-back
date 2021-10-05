const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//crear TAREA 
//api/tareas
 router.post('/',
     auth,
     [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty()
     ],
     tareaController.crearTarea
 );

 //obtener tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//actualizar tarea
router.put('/:id',
     auth,
     tareaController.actualizarTarea
);

//eliminar una tarea
router.delete('/:id',
     auth,
     tareaController.eliminarTarea
)

module.exports = router;