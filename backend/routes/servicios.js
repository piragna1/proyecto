import { Router } from 'express';
import { insertarServicio, obtenerServicios, obtenerServicioPorId } from '../controllers/serviciosController.js';

export default function (db) {
    const router = Router();

    router.post('/', insertarServicio(db));

    router.get('/', obtenerServicios(db));

    router.get('/:id', obtenerServicioPorId(db));

    return router;
}


