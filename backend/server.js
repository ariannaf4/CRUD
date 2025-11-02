const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
require('dotenv').config();

// Importar configuración de base de datos
require('./config/database');

// Importar GraphQL
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { getGraphQLContext } = require('./graphql/context');

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'CRUD App - Solo GraphQL con MongoDB' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Crear Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Inicializar Apollo Server
  await server.start();

  // Aplicar middleware de Apollo Server a Express
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: getGraphQLContext,
    })
  );

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`GraphQL disponible en http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
});
