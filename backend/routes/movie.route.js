const express = require("express");
const Movie = require("../model/movie.model");
const authMiddleware = require("../middlewares/authMiddle");

const router = express.Router();

// Validation helper function
const validateMovieData = (data) => {
    const errors = [];
    
    if (!data.title || !data.title.trim()) {
        errors.push('Title is required');
    }
    
    if (!data.genre || !data.genre.trim()) {
        errors.push('Genre is required');
    }
    
    if (!data.director || !data.director.trim()) {
        errors.push('Director is required');
    }
    
    if (!data.releaseYear || isNaN(data.releaseYear) || data.releaseYear < 1900 || data.releaseYear > new Date().getFullYear() + 5) {
        errors.push('Valid release year is required');
    }
    
    if (!data.duration || isNaN(data.duration) || data.duration < 1) {
        errors.push('Valid duration is required');
    }
    
    if (!data.rating || isNaN(data.rating) || data.rating < 1 || data.rating > 10) {
        errors.push('Rating must be between 1 and 10');
    }
    
    if (!data.description || !data.description.trim()) {
        errors.push('Description is required');
    }
    
    // Validate poster URL if provided
    if (data.poster && data.poster.trim()) {
        try {
            new URL(data.poster);
            // Check if it's a direct image URL (not a search result)
            if (data.poster.includes('bing.com/images/search') || data.poster.includes('google.com/search')) {
                errors.push('Please use a direct image URL, not a search result URL');
            }
        } catch (error) {
            errors.push('Invalid poster URL format');
        }
    }
    
    return errors;
};

// Add a new movie (CREATE)
router.post("/add", authMiddleware, async (req, res) => {
    try {
        console.log('Received movie data:', req.body); // Debug log
        
        const { title, genre, director, releaseYear, duration, rating, description, poster } = req.body;
        
        // Validate input data
        const validationErrors = validateMovieData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).send({ 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }
        
        // Clean and prepare data
        const movieData = {
            title: title.trim(),
            genre: genre.trim(),
            director: director.trim(),
            releaseYear: parseInt(releaseYear),
            duration: parseInt(duration),
            rating: parseFloat(rating),
            description: description.trim(),
            poster: poster && poster.trim() ? poster.trim() : null,
            createdBy: req.userId
        };
        
        console.log('Cleaned movie data:', movieData); // Debug log
        
        const newMovie = new Movie(movieData);
        await newMovie.save();
        
        res.status(201).send({ 
            message: "Movie added successfully", 
            movie: newMovie 
        });
    } catch (error) {
        console.error('Error adding movie:', error); // Debug log
        
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({ 
                message: "Database validation failed", 
                errors: validationErrors 
            });
        }
        
        res.status(400).send({ 
            message: "Error adding movie", 
            error: error.message 
        });
    }
});

// Get all movies (READ)
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find().populate('createdBy', 'name email');
        res.status(200).send({ message: "Movies fetched successfully", movies });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send({ message: "Error fetching movies", error: error.message });
    }
});

// Get a specific movie by ID (READ)
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('createdBy', 'name email');
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }
        res.status(200).send({ message: "Movie fetched successfully", movie });
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).send({ message: "Error fetching movie", error: error.message });
    }
});

// Get movies created by logged-in user
router.get("/my/movies", authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.find({ createdBy: req.userId });
        res.status(200).send({ message: "Your movies fetched successfully", movies });
    } catch (error) {
        console.error('Error fetching user movies:', error);
        res.status(500).send({ message: "Error fetching your movies", error: error.message });
    }
});

// Update a movie (UPDATE)
router.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        const movieId = req.params.id;
        const { title, genre, director, releaseYear, duration, rating, description, poster } = req.body;

        // Validate input data
        const validationErrors = validateMovieData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).send({ 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }

        // Check if movie exists and belongs to the user
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        if (movie.createdBy.toString() !== req.userId) {
            return res.status(403).send({ message: "You can only update your own movies" });
        }

        // Clean and prepare update data
        const updateData = {
            title: title.trim(),
            genre: genre.trim(),
            director: director.trim(),
            releaseYear: parseInt(releaseYear),
            duration: parseInt(duration),
            rating: parseFloat(rating),
            description: description.trim(),
            poster: poster && poster.trim() ? poster.trim() : null
        };

        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).send({ message: "Movie updated successfully", movie: updatedMovie });
    } catch (error) {
        console.error('Error updating movie:', error);
        
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({ 
                message: "Database validation failed", 
                errors: validationErrors 
            });
        }
        
        res.status(400).send({ message: "Error updating movie", error: error.message });
    }
});

// Delete a movie (DELETE)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const movieId = req.params.id;

        // Check if movie exists and belongs to the user
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        if (movie.createdBy.toString() !== req.userId) {
            return res.status(403).send({ message: "You can only delete your own movies" });
        }

        await Movie.findByIdAndDelete(movieId);
        res.status(200).send({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send({ message: "Error deleting movie", error: error.message });
    }
});

module.exports = router;