import { Router } from 'express';
import { loginUsuario, loginAdmin } from '../controllers/loginController.js';

export default function (db) {
    const router = Router();

    router.post('/', loginUsuario(db));
    router.post('/admin', loginAdmin(db));


    return router;
}

