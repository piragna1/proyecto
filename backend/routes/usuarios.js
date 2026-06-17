import { Router } from 'express';
import { actualizarUsuario, eliminarUsuario, insertarUsuario, obtenerUsuarioPorId, obtenerUsuarios } from '../controllers/usuariosController.js';
import { verificarToken } from '../middlewares/verificarToken.js';

export default function (db) {
    const router = Router();

    router.get("/", verificarToken, obtenerUsuarios(db));

    router.get("/:id", verificarToken, obtenerUsuarioPorId(db));

    router.post('/', insertarUsuario(db));

    router.put('/:id', verificarToken, actualizarUsuario(db));

    router.delete('/:id', verificarToken, eliminarUsuario(db));

    return router;
}