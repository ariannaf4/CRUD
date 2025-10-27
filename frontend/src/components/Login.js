import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, onToggle, dbType }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        dbType,
      });

      onLogin(response.data.token, response.data.user, response.data.dbType);
    } catch (err) {
      setError(err.response?.data?.message || 'credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      <div className="toggle-text">
        ¿No tienes cuenta? <span onClick={onToggle}>Regístrate aquí</span>
      </div>
    </div>
  );
}

export default Login;
