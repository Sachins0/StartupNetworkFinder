import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user data here if needed
    }
  }, []);

  const handleLogin = (data) => {
    console.log(data);
    setIsAuthenticated(true);
    setUserData(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('creditError');
    localStorage.removeItem('credits');
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <GoogleOAuthProvider 
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error('Google script load failed')}
      onScriptLoadSuccess={() => console.log('Google script loaded successfully')}
    >
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Dashboard onLogout={handleLogout} userData={userData} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;