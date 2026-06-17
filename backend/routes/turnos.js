import { Router } from 'express';
import { actualizarTurno, eliminarTurno, insertarTurno, obtenerTurnoPorId, obtenerTurnos } from '../controllers/turnosController.js';
import { verificarToken } from '../middlewares/verificarToken.js';

export default function (db) {
    const router = Router();

    router.get("/", verificarToken, obtenerTurnos(db));

    router.get("/:id", verificarToken, obtenerTurnoPorId(db));

    router.post('/', verificarToken, insertarTurno(db));

    router.delete('/:id', verificarToken, eliminarTurno(db));

    router.put('/:id', verificarToken, actualizarTurno(db));

    return router;
}

