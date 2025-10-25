import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import DatabaseSwitch from './components/DatabaseSwitch';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbType, setDbType] = useState(localStorage.getItem('dbType') || 'mongodb');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedDbType = localStorage.getItem('dbType');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      if (savedDbType) {
        setDbType(savedDbType);
      }
    }
  }, []);

  const handleLogin = (token, user, dbType) => {
    setToken(token);
    setCurrentUser(user);
    setDbType(dbType);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('dbType', dbType);
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('dbType');
  };

  const handleDbChange = (newDbType) => {
    setDbType(newDbType);
    localStorage.setItem('dbType', newDbType);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <div className="auth-container">
          <DatabaseSwitch dbType={dbType} onDbChange={handleDbChange} />
          {showSignup ? (
            <Signup 
              onSignup={handleLogin} 
              onToggle={() => setShowSignup(false)}
              dbType={dbType}
            />
          ) : (
            <Login 
              onLogin={handleLogin} 
              onToggle={() => setShowSignup(true)}
              dbType={dbType}
            />
          )}
        </div>
      ) : (
        <Dashboard 
          token={token} 
          currentUser={currentUser}
          dbType={dbType}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
