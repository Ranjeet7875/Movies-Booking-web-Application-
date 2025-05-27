// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Notification from './components/Notification';
import { authService, movieService } from './services/api';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [movies, setMovies] = useState([]);
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchMovies();
    }
  }, [token]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile(token);
      setUser(data.users);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Profile fetch error:', err);
      logout();
    }
  };

  const fetchMovies = async () => {
    try {
      const data = await movieService.getAllMovies();
      setMovies(data.movies || []);
    } catch (err) {
      console.error('Movies fetch error:', err);
    }
  };

  const fetchUserMovies = async () => {
    try {
      const data = await movieService.getUserMovies(token);
      setUserMovies(data.movies || []);
    } catch (err) {
      console.error('User movies fetch error:', err);
    }
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      const data = await authService.login(formData);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      showNotification('Login successful!', 'success');
    } catch (err) {
      showNotification(err.message || 'Login failed', 'error');
    }
    setLoading(false);
  };

  const handleSignup = async (formData) => {
    setLoading(true);
    try {
      await authService.signup(formData);
      showNotification('Account created successfully! Please login.', 'success');
      setCurrentView('login');
    } catch (err) {
      showNotification(err.message || 'Signup failed', 'error');
    }
    setLoading(false);
  };

  const handleAddMovie = async (movieData) => {
    setLoading(true);
    try {
      await movieService.addMovie(movieData, token);
      showNotification('Movie added successfully!', 'success');
      fetchMovies();
      fetchUserMovies();
    } catch (err) {
      showNotification(err.message || 'Failed to add movie', 'error');
    }
    setLoading(false);
  };

  const handleEditMovie = async (movieData, movieId) => {
    setLoading(true);
    try {
      await movieService.updateMovie(movieId, movieData, token);
      showNotification('Movie updated successfully!', 'success');
      fetchMovies();
      fetchUserMovies();
    } catch (err) {
      showNotification(err.message || 'Failed to update movie', 'error');
    }
    setLoading(false);
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await movieService.deleteMovie(movieId, token);
      showNotification('Movie deleted successfully!', 'success');
      fetchMovies();
      fetchUserMovies();
    } catch (err) {
      showNotification(err.message || 'Failed to delete movie', 'error');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setCurrentView('login');
    setMovies([]);
    setUserMovies([]);
  };

  return (
    <div className="app">
      <Notification 
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />

      {!token ? (
        currentView === 'login' ? (
          <Login 
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
            loading={loading}
            error={notification.type === 'error' ? notification.message : ''}
          />
        ) : (
          <Signup 
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentView('login')}
            loading={loading}
            error={notification.type === 'error' ? notification.message : ''}
          />
        )
      ) : (
        <Dashboard 
          user={user}
          movies={movies}
          userMovies={userMovies}
          onLogout={logout}
          onAddMovie={handleAddMovie}
          onEditMovie={handleEditMovie}
          onDeleteMovie={handleDeleteMovie}
          onFetchUserMovies={fetchUserMovies}
          loading={loading}
        />
      )}
    </div>
  );
};

export default App;