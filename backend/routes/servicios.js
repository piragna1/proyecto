import { Router } from 'express';
import { insertarServicio, obtenerServicios, obtenerServicioPorId, actualizarServicio, eliminarServicio } from '../controllers/serviciosController.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

export default function (db) {
    const router = Router();

    router.post('/', verificarToken, verificarRol(['administrador']), insertarServicio(db));

    router.get('/',verificarToken, obtenerServicios(db));

    router.get('/:id',verificarToken, obtenerServicioPorId(db));

    router.put('/:id', verificarToken, verificarRol(['administrador']), actualizarServicio(db));

    router.delete('/:id', verificarToken, verificarRol(['administrador']), eliminarServicio(db));

    return router;
}


