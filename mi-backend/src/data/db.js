import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Creamos el pool de conexiones usando las variables del .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 11519, // 
  ssl: { rejectUnauthorized: false },  //  para Aiven
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;