const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Obtenemos el id del JWT (auth o nuevo user) y guardamos en la propiedad creador
        proyecto.creador = req.usuario.id;

        //Guardar el proyecto
        proyecto.save();
        res.status(200).json(proyecto);

    } catch (error) {
        console.log(`catch ${error}`);
        res.status(500).json({
            msg: 'Error, favor de verificar'
        });
    }
}

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.status(200).json({
            proyectos,
            status: 'success'
        });
    } catch (error) {
        console.log(error);
    }
}

exports.actualizarProyecto = async (req, res) => {
    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            });
        }

        //Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No Autorizado'
            });
        }

        //Actualizar
        proyecto = await Proyecto.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: nuevoProyecto },
            { new: true }
        );

        res.json({ proyecto });

    } catch (error) {
        console.log(`ERROR ${error}`);
        res.status(500).send('Error en el servidor')
    }
}

exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            });
        }

        //Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No Autorizado'
            });
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndDelete({ _id: req.params.id });
        res.json({
            msg: 'Proyecto eliminado'
        });

    } catch (error) {
        console.log(`Error ${error}`);
        res.send('Error al eliminar');
    }
}