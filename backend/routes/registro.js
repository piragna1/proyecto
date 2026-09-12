import { Router } from 'express';
import { registrarUsuario } from '../controllers/usuariosController.js';

export default function (db) {
    const router = Router();

    router.post('/', registrarUsuario(db));

    return router;
}