import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './data/db.js';
import librosRoutes from './routes/libros.routes.js';
import autoresRoutes from './routes/autores.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba (Ping)
app.get('/api/v1/ping', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS resultado');
    res.json({ mensaje: 'Conexión a la BD exitosa', resultado: result[0].resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar a la BD', detalle: error.message });
  }
});

// Rutas de la API
app.use('/api/v1/libros', librosRoutes); 
app.use('/api/v1/autores', autoresRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});