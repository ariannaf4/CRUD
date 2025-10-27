const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const TaskMongo = require('../models/taskMongo');
const TaskPostgres = require('../models/taskPostgres');

// Obtener todas las tareas del usuario (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId, dbType } = req;
    let tasks;

    if (dbType === 'mongodb') {
      tasks = await TaskMongo.find({ userId }).sort({ createdAt: -1 });
    } else {
      tasks = await TaskPostgres.findByUserId(userId);
    }

    res.json({ tasks, dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
});

// Crear una nueva tarea (protegido)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const { userId, dbType } = req;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    let task;

    if (dbType === 'mongodb') {
      task = new TaskMongo({
        title,
        description: description || '',
        dueDate: dueDate || null,
        userId,
      });
      await task.save();
    } else {
      task = await TaskPostgres.create(title, description || '', dueDate || null, userId);
    }

    res.status(201).json({ message: 'Tarea creada', task, dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
});

// Actualizar una tarea (protegido)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    const { userId, dbType } = req;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    let task;

    if (dbType === 'mongodb') {
      task = await TaskMongo.findOneAndUpdate(
        { _id: id, userId },
        { title, description, dueDate, completed },
        { new: true }
      );
      
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
    } else {
      task = await TaskPostgres.update(id, title, description, dueDate, completed, userId);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
    }

    res.json({ message: 'Tarea actualizada', task, dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
});

// Eliminar una tarea (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, dbType } = req;
    let result;

    if (dbType === 'mongodb') {
      result = await TaskMongo.findOneAndDelete({ _id: id, userId });
      if (!result) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
    } else {
      result = await TaskPostgres.delete(id, userId);
      if (!result) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
    }

    res.json({ message: 'Tarea eliminada', dbType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
});

module.exports = router;
