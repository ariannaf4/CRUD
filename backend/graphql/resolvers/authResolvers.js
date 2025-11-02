const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserMongo = require('../../models/userMongo');

const authResolvers = {
  Mutation: {
    async login(_, { email, password }) {
      try {
        // Buscar usuario en MongoDB
        const user = await UserMongo.findOne({ email });
        if (!user) {
          throw new Error('Credenciales inválidas');
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error('Credenciales inválidas');
        }

        // Generar token JWT
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async signup(_, { username, email, password }) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await UserMongo.findOne({ 
          $or: [{ email }, { username }] 
        });
        if (existingUser) {
          throw new Error('Usuario o email ya existe');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = new UserMongo({
          username,
          email,
          password: hashedPassword,
        });
        await user.save();

        // Generar token JWT
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = authResolvers;