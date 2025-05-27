// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Film, Plus } from 'lucide-react';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import MovieForm from '../components/MovieForm';
import '../App.css';

const Dashboard = ({ 
  user, 
  movies, 
  userMovies, 
  onLogout, 
  onAddMovie, 
  onEditMovie, 
  onDeleteMovie,
  onFetchUserMovies,
  loading
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    if (activeTab === 'my') {
      onFetchUserMovies();
    }
  }, [activeTab, onFetchUserMovies]);

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleFormSubmit = (movieData) => {
    if (editingMovie) {
      onEditMovie(movieData, editingMovie._id);
    } else {
      onAddMovie(movieData);
    }
    setShowForm(false);
    setEditingMovie(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  const currentMovies = activeTab === 'all' ? movies : userMovies;

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        <div className="dashboard-nav">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Movies
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Movies
          </button>
          <button onClick={() => setShowForm(true)} className="add-movie-btn">
            <Plus size={18} />
            Add Movie
          </button>
        </div>

        <div className="movies-section">
          {currentMovies.length > 0 ? (
            <div className="movies-grid">
              {currentMovies.map(movie => (
                <MovieCard 
                  key={movie._id} 
                  movie={movie}
                  isOwner={activeTab === 'my' || movie.createdBy?._id === user?._id}
                  onEdit={handleEdit}
                  onDelete={onDeleteMovie}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Film size={64} />
              <h3>
                {activeTab === 'all' 
                  ? 'No movies available' 
                  : "You haven't added any movies yet"
                }
              </h3>
              <p>
                {activeTab === 'all' 
                  ? 'Be the first to add a movie!' 
                  : 'Click "Add Movie" to get started!'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <MovieForm
          movie={editingMovie}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Dashboard;