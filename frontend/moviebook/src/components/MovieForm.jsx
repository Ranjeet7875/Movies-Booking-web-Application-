import React, { useState } from 'react';
import '../App.css';

const MovieForm = ({ movie = null, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    genre: movie?.genre || '',
    director: movie?.director || '',
    releaseYear: movie?.releaseYear || '',
    duration: movie?.duration || '',
    rating: movie?.rating || '',
    description: movie?.description || '',
    poster: movie?.poster || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    if (!formData.director.trim()) newErrors.director = 'Director is required';
    if (!formData.releaseYear || formData.releaseYear < 1900 || formData.releaseYear > new Date().getFullYear() + 5) {
      newErrors.releaseYear = 'Please enter a valid release year';
    }
    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 10) {
      newErrors.rating = 'Rating must be between 1 and 10';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Validate poster URL if provided
    if (formData.poster && !isValidUrl(formData.poster)) {
      newErrors.poster = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add/edit movies');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clean the form data
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        genre: formData.genre.trim(),
        director: formData.director.trim(),
        description: formData.description.trim(),
        releaseYear: parseInt(formData.releaseYear),
        duration: parseInt(formData.duration),
        rating: parseFloat(formData.rating),
        poster: formData.poster.trim() || null
      };

      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCancel = () => {
    if (Object.keys(formData).some(key => formData[key] !== (movie?.[key] || ''))) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
          <button onClick={handleCancel} className="close-btn" type="button">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="movie-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                maxLength="100"
                required
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="genre">Genre *</label>
              <input
                id="genre"
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={errors.genre ? 'error' : ''}
                maxLength="50"
                required
              />
              {errors.genre && <span className="error-message">{errors.genre}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="director">Director *</label>
              <input
                id="director"
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                className={errors.director ? 'error' : ''}
                maxLength="100"
                required
              />
              {errors.director && <span className="error-message">{errors.director}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year *</label>
              <input
                id="releaseYear"
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                className={errors.releaseYear ? 'error' : ''}
                min="1900"
                max={new Date().getFullYear() + 5}
                required
              />
              {errors.releaseYear && <span className="error-message">{errors.releaseYear}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes) *</label>
              <input
                id="duration"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={errors.duration ? 'error' : ''}
                min="1"
                max="1000"
                required
              />
              {errors.duration && <span className="error-message">{errors.duration}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating (1-10) *</label>
              <input
                id="rating"
                type="number"
                name="rating"
                min="1"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className={errors.rating ? 'error' : ''}
                required
              />
              {errors.rating && <span className="error-message">{errors.rating}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="poster">Poster URL</label>
            <input
              id="poster"
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              className={errors.poster ? 'error' : ''}
              placeholder="https://example.com/poster.jpg"
            />
            {errors.poster && <span className="error-message">{errors.poster}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="4"
              maxLength="500"
              placeholder="Enter movie description..."
              required
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <small className="char-count">
              {formData.description.length}/500 characters
            </small>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="cancel-btn"
              disabled={isSubmitting || loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Saving...' : (movie ? 'Update Movie' : 'Add Movie')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;