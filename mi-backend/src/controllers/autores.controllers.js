import pool from '../data/db.js';

export const obtenerAutores = async (req, res) => {
  try {  
    
    const [autores] = await pool.query(
      `SELECT * FROM autores`      
    );

    res.json(autores);

  } catch (error) {
    res.status(500).json({ 
      error: 'Error al buscar los autores en la base de datos',
      detalle: error.message 
    });
  }
};