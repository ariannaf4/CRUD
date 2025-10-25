import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ token, currentUser, dbType, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
  };

  const handleUpdate = async () => {
    try {
      const userId = editingUser._id || editingUser.id;
      await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        {
          username: editUsername,
          email: editEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar usuario');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Panel de Control</h1>
          <span className={`db-indicator db-${dbType}`}>
            {dbType === 'mongodb' ? 'MongoDB' : 'PostgreSQL'}
          </span>
        </div>
        <div className="user-info">
          <span>Bienvenido, {currentUser.username}</span>
          <button onClick={onLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : (
        <div>
          <h2>Lista de Usuarios</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user._id || user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn-small btn-edit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user._id || user.id)}
                        className="btn-small btn-delete"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleUpdate} className="btn btn-primary">
                Guardar
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
