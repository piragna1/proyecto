import { Router } from 'express';
import { actualizarTurno, eliminarTurno, insertarTurno, obtenerTurnoPorId, obtenerTurnos } from '../controllers/turnosController.js';

export default function (db) {
    const router = Router();

    router.get("/", obtenerTurnos(db));

    router.get("/:id", obtenerTurnoPorId(db));

    router.post('/', insertarTurno(db));

    router.delete('/:id', eliminarTurno(db));

    router.put('/:id', actualizarTurno(db));

    return router;
}

