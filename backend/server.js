const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
