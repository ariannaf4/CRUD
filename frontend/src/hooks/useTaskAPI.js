import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook para manejar tareas con GraphQL y MongoDB
 */
export const useTaskAPI = (token) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener tareas
  const fetchTasks = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/graphql',
        {
          query: `
            query GetTasks {
              tasks {
                id
                title
                description
                dueDate
                completed
                userId
                createdAt
              }
            }
          `
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (response.data.errors) {
        setError(response.data.errors[0].message);
        setTasks([]);
      } else {
        setTasks(response.data.data.tasks || []);
        setError('');
      }
    } catch (err) {
      setError('Error al cargar tareas');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Función para crear tarea
  const createTask = async (taskData) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/graphql',
        {
          query: `
            mutation CreateTask($title: String!, $description: String, $dueDate: String) {
              createTask(title: $title, description: $description, dueDate: $dueDate) {
                id
                title
                description
                dueDate
                completed
                userId
                createdAt
              }
            }
          `,
          variables: taskData
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      // Recargar tareas después de crear
      await fetchTasks();
      return response.data.data.createTask;
    } catch (err) {
      throw new Error(err.message || 'Error al crear tarea');
    }
  };

  // Función para actualizar tarea
  const updateTask = async (taskId, taskData) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/graphql',
        {
          query: `
            mutation UpdateTask($id: ID!, $title: String, $description: String, $dueDate: String, $completed: Boolean) {
              updateTask(id: $id, title: $title, description: $description, dueDate: $dueDate, completed: $completed) {
                id
                title
                description
                dueDate
                completed
                userId
                createdAt
              }
            }
          `,
          variables: {
            id: taskId,
            ...taskData
          }
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      // Recargar tareas después de actualizar
      await fetchTasks();
      return response.data.data.updateTask;
    } catch (err) {
      throw new Error(err.message || 'Error al actualizar tarea');
    }
  };

  // Función para eliminar tarea
  const deleteTask = async (taskId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/graphql',
        {
          query: `
            mutation DeleteTask($id: ID!) {
              deleteTask(id: $id)
            }
          `,
          variables: {
            id: taskId
          }
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      // Recargar tareas después de eliminar
      await fetchTasks();
      return true;
    } catch (err) {
      throw new Error(err.message || 'Error al eliminar tarea');
    }
  };

  // Cargar tareas cuando hay token
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks
  };
};