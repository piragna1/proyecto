import { Router } from 'express';
import { actualizarUsuario, eliminarUsuario, insertarUsuario, obtenerUsuarioPorId, obtenerUsuarios } from '../controllers/usuariosController.js';
export default function (db) {
    const router = Router();

    router.get("/", obtenerUsuarios(db));

    router.get("/:id", obtenerUsuarioPorId(db));

    router.post('/', insertarUsuario(db));

    router.put('/:id', actualizarUsuario(db));

    router.delete('/:id', eliminarUsuario(db));

    return router;
}