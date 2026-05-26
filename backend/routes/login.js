import { Router } from 'express';
import { loginUsuario } from '../controllers/loginController.js';

export default function (db) {
    const router = Router();

    router.post('/', loginUsuario(db));

    return router;
}

