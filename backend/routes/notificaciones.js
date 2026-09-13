//notificaciones.js
import { Router } from 'express';
import { obtenerNotificaciones } from '../controllers/notificacionesController.js';
import { verificarToken } from '../middlewares/verificarToken.js';
import { verificarRol } from '../middlewares/verificarRol.js';

export default function (db) {
    const router = Router();

    router.get("/", verificarToken, verificarRol(['administrador']), obtenerNotificaciones(db));

    return router;
}