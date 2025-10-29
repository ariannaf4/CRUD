const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const UserMongo = require('../models/userMongo');

// Obtener todos los usuarios (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await UserMongo.find().select('-password');
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// Obtener un usuario por ID (protegido)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserMongo.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
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

    if (!username || !email) {
      return res.status(400).json({ message: 'Username y email son requeridos' });
    }

    const user = await UserMongo.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// Eliminar usuario (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserMongo.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;
