import { Router } from 'express';
import { obtenerPagos, registrarPago } from '../controllers/pagosController.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

export default function (db) {
    const router = Router();

    router.post('/', verificarToken, verificarRol(['administrador', 'peluquero']), registrarPago(db));

    router.get('/', verificarToken, verificarRol(['administrador', 'peluquero']), obtenerPagos(db));

    return router;
}