const mongoose = require('mongoose');

// Configuración de MongoDB local con Docker
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crud_db';
    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado exitosamente');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    console.log('Asegúrate de que MongoDB esté corriendo con Docker');
  }
};

connectMongoDB();

module.exports = { mongoose };
