import React from 'react';
import './DatabaseSwitch.css';

function DatabaseSwitch({ dbType, onDbChange }) {
  return (
    <div className="database-switch">
      <div className="switch-header">
        <h3>Selecciona la Base de Datos</h3>
      </div>
      <div className="switch-container">
        <button
          className={`switch-option ${dbType === 'mongodb' ? 'active mongodb' : ''}`}
          onClick={() => onDbChange('mongodb')}
        >
          <span className="db-icon">M</span>
          <span className="db-name">MongoDB</span>
        </button>
        <button
          className={`switch-option ${dbType === 'postgres' ? 'active postgres' : ''}`}
          onClick={() => onDbChange('postgres')}
        >
          <span className="db-icon">P</span>
          <span className="db-name">PostgreSQL</span>
        </button>
      </div>
      <div className="current-db">
        Base de datos actual: <strong>{dbType === 'mongodb' ? 'MongoDB' : 'PostgreSQL'}</strong>
      </div>
    </div>
  );
}

export default DatabaseSwitch;
