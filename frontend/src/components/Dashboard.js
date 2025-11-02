import React, { useState } from 'react';
import { useTaskAPI } from '../hooks/useTaskAPI';

function Dashboard({ token, currentUser, onLogout }) {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
  });

  // Hook para manejar tareas
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask
  } = useTaskAPI(token);

  const [uiError, setUiError] = useState('');

  // Formatear fecha para mostrar (sin zona horaria)
  const formatDate = (date) => {
    if (!date) return '';
    try {
      // Crear fecha local sin conversión de zona horaria
      const dateObj = new Date(date + 'T00:00:00');
      return dateObj.toLocaleDateString('es-ES');
    } catch (error) {
      return '';
    }
  };

  // Formatear fecha para input (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    try {
      // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return date;
      }
      // Si es una fecha ISO, extraer solo la parte de la fecha
      if (typeof date === 'string' && date.includes('T')) {
        return date.split('T')[0];
      }
      return new Date(date).toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: formatDateForInput(task.dueDate),
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
    setUiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setUiError('El título es requerido');
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      closeModal();
    } catch (err) {
      setUiError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
        setUiError('');
      } catch (err) {
        setUiError(err.message);
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      setUiError('');
    } catch (err) {
      setUiError(err.message);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Mis Tareas</h1>
        <div className="user-info">
          <span>{currentUser.username}</span>
          <button onClick={onLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {(error || uiError) && (
        <div className="error-message">{error || uiError}</div>
      )}

      <button onClick={() => openModal()} className="create-task-button">
        + Nueva Tarea
      </button>

      {loading ? (
        <div className="loading">Cargando tareas...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tienes tareas aún. ¡Crea tu primera tarea!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <div className="task-header">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />
                <h3>{task.title}</h3>
              </div>
              {task.description && <p>{task.description}</p>}
              {task.dueDate && (
                <p className="task-date">
                  Vence: {formatDate(task.dueDate)}
                </p>
              )}
              <div className="task-actions">
                <button onClick={() => openModal(task)} className="btn-small btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(task.id)} className="btn-small btn-delete">
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
            {uiError && <div className="error-message">{uiError}</div>}
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
                  rows="3"
                  placeholder="Descripción opcional..."
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
