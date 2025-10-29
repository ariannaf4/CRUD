const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const TaskMongo = require("../models/taskMongo");
const TaskPostgres = require("../models/taskPostgres");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    let allTasks = [];

    try {
      const mongoTasks = await TaskMongo.find({ userId: userId.toString() });
      allTasks = allTasks.concat(mongoTasks.map(task => ({ ...task.toObject(), dbType: "mongodb" })));
    } catch (error) {
      console.log("Error MongoDB:", error.message);
    }

    try {
      // Convertir ObjectId a hash numérico para buscar en PostgreSQL
      const userIdHash = userId.toString().split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const userIdInt = Math.abs(userIdHash);
      
      const postgresTasks = await TaskPostgres.findByUserId(userIdInt);
      allTasks = allTasks.concat(postgresTasks.map(task => ({ ...task, dbType: "postgres" })));
    } catch (error) {
      console.log("Error PostgreSQL:", error.message);
    }

    res.json({ tasks: allTasks });
  } catch (error) {
    console.error("Error obteniendo tareas:", error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, dbType } = req.body;
    const { userId } = req;

    if (!title || !dbType) {
      return res.status(400).json({ message: "Título y tipo de BD requeridos" });
    }

    let task;

    if (dbType === "mongodb") {
      task = new TaskMongo({
        title,
        description: description || "",
        dueDate: dueDate || null,
        userId: userId.toString(),
      });
      await task.save();
    } else {
      // Convertir ObjectId de MongoDB a número para PostgreSQL
      const userIdHash = userId.toString().split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const userIdInt = Math.abs(userIdHash);
      
      task = await TaskPostgres.create(title, description || "", dueDate || null, userIdInt);
    }

    res.status(201).json({ message: "Tarea creada", task });
  } catch (error) {
    console.error("Error creando tarea:", error);
    res.status(500).json({ message: "Error al crear tarea" });
  }
});

router.put("/:id/:dbType", authMiddleware, async (req, res) => {
  try {
    const { id, dbType } = req.params;
    const { title, description, dueDate, completed } = req.body;
    const { userId } = req;

    let task;

    if (dbType === "mongodb") {
      task = await TaskMongo.findOneAndUpdate(
        { _id: id, userId: userId.toString() },
        { title, description, dueDate, completed },
        { new: true }
      );
    } else {
      // Convertir ObjectId a hash numérico para PostgreSQL
      const userIdHash = userId.toString().split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const userIdInt = Math.abs(userIdHash);
      
      task = await TaskPostgres.update(id, title, description, dueDate, completed, userIdInt);
    }

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea actualizada", task });
  } catch (error) {
    console.error("Error actualizando tarea:", error);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
});

router.delete("/:id/:dbType", authMiddleware, async (req, res) => {
  try {
    const { id, dbType } = req.params;
    const { userId } = req;

    let result;

    if (dbType === "mongodb") {
      result = await TaskMongo.findOneAndDelete({ _id: id, userId: userId.toString() });
    } else {
      // Convertir ObjectId a hash numérico para PostgreSQL
      const userIdHash = userId.toString().split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const userIdInt = Math.abs(userIdHash);
      
      result = await TaskPostgres.delete(id, userIdInt);
    }

    if (!result) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    console.error("Error eliminando tarea:", error);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
});

module.exports = router;
