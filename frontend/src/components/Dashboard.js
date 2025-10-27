import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ token, currentUser, dbType, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
  });

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data.tasks);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: task.due_date || task.dueDate || '',
        completed: task.completed,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', dueDate: '', completed: false });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', dueDate: '', completed: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }

    try {
      if (editingTask) {
        const taskId = editingTask._id || editingTask.id;
        await axios.put(
          `http://localhost:5000/api/tasks/${taskId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/tasks',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      closeModal();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar tarea');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar tarea');
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      const taskId = task._id || task.id;
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          title: task.title,
          description: task.description,
          dueDate: task.due_date || task.dueDate,
          completed: !task.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar tarea');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Mis Tareas</h1>
          <span className={`db-indicator db-${dbType}`}>
            {dbType === 'mongodb' ? 'MongoDB' : 'PostgreSQL'}
          </span>
        </div>
        <div className="user-info">
          <span>{currentUser.username}</span>
          <button onClick={onLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => openModal()} className="btn btn-primary">
          + Nueva Tarea
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando tareas...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tienes tareas aún. ¡Crea tu primera tarea!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task._id || task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <div className="task-header">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  className="task-checkbox"
                />
                <h3 className={task.completed ? 'task-title-completed' : ''}>{task.title}</h3>
              </div>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              {(task.due_date || task.dueDate) && (
                <p className="task-date">{formatDate(task.due_date || task.dueDate)}</p>
              )}
              <div className="task-actions">
                <button onClick={() => openModal(task)} className="btn-small btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(task._id || task.id)} className="btn-small btn-delete">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Comprar leche"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles de la tarea..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Fecha límite</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              {editingTask && (
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.completed}
                      onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                    />
                    {' '}Completada
                  </label>
                </div>
              )}
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
