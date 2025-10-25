const mongoose = require('mongoose');
const { Pool } = require('pg');

// Configuración de MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
};

// Configuración de PostgreSQL
const pgPool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// Crear tabla de usuarios en PostgreSQL si no existe
const initPostgresDB = async () => {
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('PostgreSQL conectado y tabla usuarios creada');
  } catch (error) {
    console.error('Error inicializando PostgreSQL:', error);
  }
};

// Inicializar bases de datos
connectMongoDB();
initPostgresDB();

module.exports = { mongoose, pgPool };
