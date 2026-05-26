import { Router } from 'express';
import { eliminarTurno, insertarTurno, obtenerTurnos } from '../controllers/turnosController.js';

export default function (db) {
    const router = Router();

    router.get("/", obtenerTurnos(db));

    router.post('/', insertarTurno(db));

    router.delete('/:id', eliminarTurno(db));

    return router;
}

