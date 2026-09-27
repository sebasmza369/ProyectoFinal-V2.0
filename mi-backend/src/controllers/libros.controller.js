import pool from '../data/db.js';

export const obtenerLibros = async (req, res) => {
  try {
    
    const { buscar } = req.query;

    let libros;

    
    if (buscar) {
      
      const [resultado] = await pool.query(
        `SELECT libros.*, autores.nombre AS autor, generos.nombre AS genero
         FROM libros 
         JOIN autores ON libros.id_autor = autores.id 
         JOIN generos ON libros.id_genero = generos.id 
         WHERE libros.titulo LIKE ?`,
        [`%${buscar}%`]
      );
      libros = resultado;
    } else {
      
      const [resultado] = await pool.query(
        `SELECT libros.*, autores.nombre AS autor, generos.nombre AS genero
         FROM libros 
         JOIN autores ON libros.id_autor = autores.id 
         JOIN generos ON libros.id_genero = generos.id`
      );
      libros = resultado;
    }
    
    res.json(libros);

  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener los libros de la base de datos',
      detalle: error.message 
    });
  }
};

export const obtenerLibroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [libros] = await pool.query(
      `SELECT libros.*, autores.nombre AS autor, generos.nombre AS genero 
       FROM libros 
       JOIN autores ON libros.id_autor = autores.id 
       JOIN generos ON libros.id_genero = generos.id
       WHERE libros.id = ?`,
      [id]
    );

    if (libros.length === 0) {
      return res.status(404).json({ mensaje: 'El libro solicitado no existe' });
    }

    res.json(libros[0]);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al buscar el libro en la base de datos',
      detalle: error.message 
    });
  }
};

const obtenerOCrearId = async (tabla, columnaNombre, valor) => {
 
  const [existente] = await pool.query(
    `SELECT id FROM ${tabla} WHERE ${columnaNombre} = ?`, 
    [valor]
  );

  if (existente.length > 0) {
    return existente[0].id; 
  }
  
  const [nuevo] = await pool.query(
    `INSERT INTO ${tabla} (${columnaNombre}) VALUES (?)`, 
    [valor]
  );
  
  return nuevo.insertId; 
};

export const crearLibro = async (req, res) => {
  const { titulo, sinopsis, anio_publicacion, autor, genero } = req.body;
  
  if (!titulo || !autor || !genero) {
    return res.status(400).json({ 
      mensaje: 'El título, el autor y el género son campos obligatorios.' 
    });
  }

  try {
    
    const id_autor = await obtenerOCrearId('autores', 'nombre', autor);
    const id_genero = await obtenerOCrearId('generos', 'nombre', genero);
   
    const query = `
      INSERT INTO libros (titulo, sinopsis, anio_publicacion, id_autor, id_genero) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [resultado] = await pool.query(query, [
      titulo, 
      sinopsis || null, 
      anio_publicacion || null, 
      id_autor,
      id_genero
    ]);

    res.status(201).json({
      mensaje: 'Libro creado exitosamente',
      id: resultado.insertId,
      libro: { titulo, sinopsis, anio_publicacion, id_autor, id_genero }
    });

  } catch (error) {
    console.error('Error al insertar el libro:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor al crear el libro',
      error: error.message 
    });
  }
};

export const eliminarLibro = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query('DELETE FROM libros WHERE id = ?', [id]);
  
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'El libro a eliminar no existe' });
    }

    res.json({ mensaje: 'Libro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el libro:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor al eliminar el libro',
      error: error.message 
    });
  }
};

export const actualizarLibro = async (req, res) => {
  const { id } = req.params;
  const { titulo, sinopsis, anio_publicacion, autor, genero } = req.body;
  
  if (!titulo || !autor || !genero) {
    return res.status(400).json({ 
      mensaje: 'El título, el autor y el género son campos obligatorios.' 
    });
  }

  try {
    
    const id_autor = await obtenerOCrearId('autores', 'nombre', autor);
    const id_genero = await obtenerOCrearId('generos', 'nombre', genero);
    
    const query = `
      UPDATE libros 
      SET titulo = ?, sinopsis = ?, anio_publicacion = ?, id_autor = ?, id_genero = ? 
      WHERE id = ?
    `;

    const [resultado] = await pool.query(query, [
      titulo, 
      sinopsis || null, 
      anio_publicacion || null, 
      id_autor, 
      id_genero, 
      id
    ]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'El libro a actualizar no existe.' });
    }

    res.json({ mensaje: 'Libro actualizado exitosamente.' });

  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor al actualizar el libro',
      error: error.message 
    });
  }
};