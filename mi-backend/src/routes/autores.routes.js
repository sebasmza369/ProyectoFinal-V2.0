import { Router } from 'express';
import { obtenerAutores } from '../controllers/autores.controllers.js';

const router = Router();

// Definimos la ruta relativa para obtener la lista de autores
router.get('/', obtenerAutores);

export default router;