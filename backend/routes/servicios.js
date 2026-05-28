import { Router } from 'express';
import { insertarServicio, obtenerServicios, obtenerServicioPorId, actualizarServicio, eliminarServicio } from '../controllers/serviciosController.js';

export default function (db) {
    const router = Router();

    router.post('/', insertarServicio(db));

    router.get('/', obtenerServicios(db));

    router.get('/:id', obtenerServicioPorId(db));

    router.put('/:id', actualizarServicio(db));

    router.delete('/:id', eliminarServicio(db));

    return router;
}


