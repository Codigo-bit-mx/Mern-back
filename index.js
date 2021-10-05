const express = require('express');
const conectarDB = require('./config/db');
const cors = require ('cors');

// crear el servidor 
const app = express();

//conectar a la BD
conectarDB();

//habilitar cors
app.use(cors());

//habilitar express json 
app.use(express.json({ extended: true}));

//PUERTO DE LA APP
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//DEFINIAR LA PAGINA PRINCIPAL
app.get('/', (req, res) => {
    res.send('hola mundo');
})

//ARRANCAR LA APP
app.listen(PORT, () => {
    console.log(`el servidor esta funcionando en el puerto ${PORT}`)
})