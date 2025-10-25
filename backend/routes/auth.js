const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserMongo = require('../models/userMongo');
const UserPostgres = require('../models/userPostgres');

// Registro de usuario
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, dbType } = req.body;

    // Validación básica
    if (!username || !email || !password || !dbType) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (!['postgres', 'mongodb'].includes(dbType)) {
      return res.status(400).json({ message: 'Tipo de base de datos no válido' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    let userId;

    if (dbType === 'mongodb') {
      // Verificar si el usuario ya existe
      const existingUser = await UserMongo.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Usuario o email ya existe' });
      }

      // Crear usuario en MongoDB
      user = new UserMongo({
        username,
        email,
        password: hashedPassword,
      });
      await user.save();
      userId = user._id;
    } else {
      // Verificar si el usuario ya existe
      const existingEmail = await UserPostgres.findByEmail(email);
      const existingUsername = await UserPostgres.findByUsername(username);
      
      if (existingEmail || existingUsername) {
        return res.status(400).json({ message: 'Usuario o email ya existe' });
      }

      // Crear usuario en PostgreSQL
      user = await UserPostgres.create(username, email, hashedPassword);
      userId = user.id;
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId, dbType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: userId,
        username: user.username,
        email: user.email,
      },
      dbType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password, dbType } = req.body;

    // Validación básica
    if (!email || !password || !dbType) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (!['postgres', 'mongodb'].includes(dbType)) {
      return res.status(400).json({ message: 'Tipo de base de datos no válido' });
    }

    let user;
    let userId;

    if (dbType === 'mongodb') {
      // Buscar usuario en MongoDB
      user = await UserMongo.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
      userId = user._id;
    } else {
      // Buscar usuario en PostgreSQL
      user = await UserPostgres.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
      userId = user.id;
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId, dbType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: userId,
        username: user.username,
        email: user.email,
      },
      dbType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

module.exports = router;
