const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const UserMongo = require('../models/userMongo');
const UserPostgres = require('../models/userPostgres');

// Obtener todos los usuarios (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { dbType } = req;
    let users;

    if (dbType === 'mongodb') {
      users = await UserMongo.find().select('-password');
    } else {
      users = await UserPostgres.findAll();
    }

    res.json({ users, dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// Obtener un usuario por ID (protegido)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { dbType } = req;
    let user;

    if (dbType === 'mongodb') {
      user = await UserMongo.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      user = await UserPostgres.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }

    res.json({ user, dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// Actualizar usuario (protegido)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    const { dbType } = req;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username y email son requeridos' });
    }

    let user;

    if (dbType === 'mongodb') {
      user = await UserMongo.findByIdAndUpdate(
        id,
        { username, email },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      user = await UserPostgres.update(id, username, email);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }

    res.json({ message: 'Usuario actualizado', user, dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// Eliminar usuario (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { dbType } = req;
    let result;

    if (dbType === 'mongodb') {
      result = await UserMongo.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      result = await UserPostgres.delete(id);
      if (!result) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }

    res.json({ message: 'Usuario eliminado', dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;
