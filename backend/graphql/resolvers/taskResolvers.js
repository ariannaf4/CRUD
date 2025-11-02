const TaskMongo = require('../../models/taskMongo');
const UserMongo = require('../../models/userMongo');

const taskResolvers = {
  Query: {
    async tasks(_, __, { userId }) {
      if (!userId) {
        throw new Error('No autorizado');
      }

      try {
        const mongoTasks = await TaskMongo.find({ userId }).sort({ createdAt: -1 });
        
        return mongoTasks.map(task => ({
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          dueDate: task.dueDate || null,
          completed: task.completed,
          userId: task.userId.toString(),
          createdAt: task.createdAt.toISOString(),
        }));
      } catch (error) {
        throw new Error('Error al obtener tareas: ' + error.message);
      }
    },

    async task(_, { id }, { userId }) {
      if (!userId) {
        throw new Error('No autorizado');
      }

      try {
        const task = await TaskMongo.findOne({ _id: id, userId });
        if (!task) return null;
        
        return {
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          dueDate: task.dueDate || null,
          completed: task.completed,
          userId: task.userId.toString(),
          createdAt: task.createdAt.toISOString(),
        };
      } catch (error) {
        throw new Error('Error al obtener tarea: ' + error.message);
      }
    },

    async me(_, __, { userId }) {
      if (!userId) return null;

      try {
        const user = await UserMongo.findById(userId);
        if (!user) return null;

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        };
      } catch (error) {
        throw new Error('Error al obtener usuario: ' + error.message);
      }
    },
  },

  Mutation: {
    async createTask(_, { title, description, dueDate }, { userId }) {
      if (!userId) {
        throw new Error('No autorizado');
      }

      try {
        const taskData = {
          title,
          description: description || '',
          completed: false,
          userId,
        };

        // Solo agregar dueDate si se proporciona
        if (dueDate) {
          taskData.dueDate = dueDate;
        }

        const task = new TaskMongo(taskData);
        await task.save();

        return {
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          dueDate: task.dueDate || null,
          completed: task.completed,
          userId: task.userId.toString(),
          createdAt: task.createdAt.toISOString(),
        };
      } catch (error) {
        throw new Error('Error al crear tarea: ' + error.message);
      }
    },

    async updateTask(_, { id, title, description, dueDate, completed }, { userId }) {
      if (!userId) {
        throw new Error('No autorizado');
      }

      try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (dueDate !== undefined) {
          updateData.dueDate = dueDate || null;
        }
        if (completed !== undefined) updateData.completed = completed;

        const task = await TaskMongo.findOneAndUpdate(
          { _id: id, userId },
          updateData,
          { new: true }
        );
        
        if (!task) {
          throw new Error('Tarea no encontrada');
        }

        return {
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          dueDate: task.dueDate || null,
          completed: task.completed,
          userId: task.userId.toString(),
          createdAt: task.createdAt.toISOString(),
        };
      } catch (error) {
        throw new Error('Error al actualizar tarea: ' + error.message);
      }
    },

    async deleteTask(_, { id }, { userId }) {
      if (!userId) {
        throw new Error('No autorizado');
      }

      try {
        const result = await TaskMongo.deleteOne({ _id: id, userId });
        return result.deletedCount > 0;
      } catch (error) {
        throw new Error('Error al eliminar tarea: ' + error.message);
      }
    },
  },
};

module.exports = taskResolvers;