import { Router } from 'express';
import { actualizarTurno, eliminarTurno, insertarTurno, insertarTurnoMostrador, obtenerTurnoPorId, obtenerTurnos } from '../controllers/turnosController.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

export default function (db) {
    const router = Router();

    router.get("/", verificarToken, obtenerTurnos(db));

    router.get("/:id", verificarToken, obtenerTurnoPorId(db));

    router.post('/mostrador', verificarToken, verificarRol(['administrador', 'peluquero']), insertarTurnoMostrador(db));

    router.post('/', verificarToken, insertarTurno(db));

    router.delete('/:id', verificarToken, eliminarTurno(db));

    router.put('/:id', verificarToken, actualizarTurno(db));

    return router;
}

