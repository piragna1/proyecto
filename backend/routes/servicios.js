import { Router } from 'express';
import { insertarServicio, obtenerServicios, obtenerServicioPorId, actualizarServicio, eliminarServicio } from '../controllers/serviciosController.js';
import { verificarToken } from '../middlewares/verificarToken.js';

export default function (db) {
    const router = Router();

    router.post('/', verificarToken, insertarServicio(db));

    router.get('/',verificarToken, obtenerServicios(db));

    router.get('/:id',verificarToken, obtenerServicioPorId(db));

    router.put('/:id', verificarToken, actualizarServicio(db));

    router.delete('/:id', verificarToken, eliminarServicio(db));

    return router;
}


