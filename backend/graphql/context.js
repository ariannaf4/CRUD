const jwt = require('jsonwebtoken');

const getGraphQLContext = ({ req }) => {
  let userId = null;

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    }
  } catch (error) {
    // Token inválido, dejamos que los resolvers manejen la autorización
    userId = null;
  }

  return {
    userId,
  };
};

module.exports = { getGraphQLContext };