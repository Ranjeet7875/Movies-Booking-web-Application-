import React from 'react';
import { Film, Star, Clock, Calendar, Edit3, Trash2 } from 'lucide-react';
import '../App.css';

const MovieCard = ({ movie, isOwner = false, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      onDelete(movie._id);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} />
        ) : (
          <div className="poster-placeholder">
            <Film size={40} />
          </div>
        )}
      </div>
      
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <p className="movie-director">Directed by {movie.director}</p>
        
        <div className="movie-meta">
          <span className="meta-item">
            <Star size={16} />
            {movie.rating}/10
          </span>
          <span className="meta-item">
            <Calendar size={16} />
            {movie.releaseYear}
          </span>
          <span className="meta-item">
            <Clock size={16} />
            {movie.duration} min
          </span>
        </div>
        
        <p className="movie-description">{movie.description}</p>
        
        {movie.createdBy && (
          <p className="movie-creator">
            Added by: {movie.createdBy.name}
          </p>
        )}
        
        {isOwner && (
          <div className="movie-actions">
            <button onClick={() => onEdit(movie)} className="edit-btn">
              <Edit3 size={16} /> Edit
            </button>
            <button onClick={handleDelete} className="delete-btn">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;