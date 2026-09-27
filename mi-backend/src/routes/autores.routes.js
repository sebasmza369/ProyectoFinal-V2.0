import { Router } from 'express';
import { obtenerAutores } from '../controllers/autores.controllers.js';

const router = Router();

router.get('/', obtenerAutores);

export default router;