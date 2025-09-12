import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_AGENDAMIENTO_HOST,
  user: process.env.DB_AGENDAMIENTO_USER,
  password: process.env.DB_AGENDAMIENTO_PASSWORD,
  database: process.env.DB_AGENDAMIENTO_NAME,
  port: Number(process.env.DB_AGENDAMIENTO_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
