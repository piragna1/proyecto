import { Router } from 'express';
import { actualizarUsuario, cambiarClave, eliminarUsuario, insertarUsuario, obtenerUsuarioPorId, obtenerUsuarios } from '../controllers/usuariosController.js';
import { verificarToken } from '../middlewares/verificarToken.js';

export default function (db) {
    const router = Router();

    router.get("/", verificarToken, obtenerUsuarios(db));

    router.get("/:id", verificarToken, obtenerUsuarioPorId(db));

    router.post('/', verificarToken, insertarUsuario(db));

    router.put('/:id', verificarToken, actualizarUsuario(db));

    router.post('/:id/cambiar-clave', verificarToken, cambiarClave(db));

    router.delete('/:id', verificarToken, eliminarUsuario(db));

    return router;
}