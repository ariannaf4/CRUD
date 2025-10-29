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

// Crear tablas en PostgreSQL si no existen
const initPostgresDB = async () => {
  try {
    // Eliminar tabla tasks si existe (para quitar la restricción de clave foránea)
    await pgPool.query(`DROP TABLE IF EXISTS tasks`);
    
    // Tabla de tareas (sin restricción de clave foránea a users)
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        completed BOOLEAN DEFAULT FALSE,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('PostgreSQL conectado y tablas creadas');
  } catch (error) {
    console.error('Error inicializando PostgreSQL:', error);
  }
};

// Inicializar bases de datos
connectMongoDB();
initPostgresDB();

module.exports = { mongoose, pgPool };
