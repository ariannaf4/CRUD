import React from 'react';
import './DatabaseSwitch.css';

function DatabaseSwitch({ dbType, onDbChange, title = "Selecciona la Base de Datos" }) {
  return (
    <div className="database-switch">
      <h3>{title}</h3>
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
    </div>
  );
}

export default DatabaseSwitch;
