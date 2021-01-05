const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//crear el servidor
const app = express();

//Conectar a la base de datos
connectDB();

//Habilitar cors
app.use(cors());

//Middleware Habilitar express.json
app.use(express.json({ extended: true }));

//puerto de la app
const port = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//arrancar la app a production
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionado en el puerto ${port}`);
});