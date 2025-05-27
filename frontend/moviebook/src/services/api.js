// src/services/api.js
const API_BASE = 'http://localhost:6934';

// Generic API call function
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

// Authentication service
export const authService = {
  login: async (credentials) => {
    return await apiCall('/users-book/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  signup: async (userData) => {
    return await apiCall('/users-book/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async (token) => {
    return await apiCall('/users-book/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

// Movie service
export const movieService = {
  getAllMovies: async () => {
    return await apiCall('/movie/');
  },

  getUserMovies: async (token) => {
    return await apiCall('/movie/my/movies', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getMovieById: async (id) => {
    return await apiCall(`/movie/${id}`);
  },

  addMovie: async (movieData, token) => {
    return await apiCall('/movie/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });
  },

  updateMovie: async (id, movieData, token) => {
    return await apiCall(`/movie/update/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });
  },

  deleteMovie: async (id, token) => {
    return await apiCall(`/movie/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};