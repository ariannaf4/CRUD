import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Crear el enlace HTTP hacia nuestro servidor GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

// Middleware para agregar el token de autenticación
const authLink = setContext((_, { headers }) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  // Retornar los headers con el token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Crear el cliente Apollo
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // Configuraciones adicionales
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

export default apolloClient;