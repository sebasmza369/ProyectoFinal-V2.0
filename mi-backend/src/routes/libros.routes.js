import { Router } from 'express';
import { obtenerLibros, obtenerLibroPorId, crearLibro, eliminarLibro, actualizarLibro } from '../controllers/libros.controller.js';

const router = Router();

// Definimos la ruta relativa para obtener los libros
router.get('/', obtenerLibros);

router.get('/:id', obtenerLibroPorId);

router.post('/', crearLibro);

router.put('/:id', actualizarLibro);

router.delete('/:id', eliminarLibro);

export default router;