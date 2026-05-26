import { Router } from 'express';
import { insertarUsuario, obtenerUsuarioPorId, obtenerUsuarios } from '../controllers/usuariosController.js';
export default function (db) {
    const router = Router();

    router.get("/", obtenerUsuarios(db));

    router.get("/:id", obtenerUsuarioPorId(db));

    router.post('/', insertarUsuario(db));
    return router;
}

