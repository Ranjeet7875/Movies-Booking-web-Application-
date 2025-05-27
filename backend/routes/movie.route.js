const express = require("express");
const Movie = require("../model/movie.model");
const authMiddleware = require("../middlewares/authMiddle");

const router = express.Router();

// Add a new movie (CREATE)
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { title, genre, director, releaseYear, duration, rating, description, poster } = req.body;
        
        const newMovie = new Movie({
            title,
            genre,
            director,
            releaseYear,
            duration,
            rating,
            description,
            poster,
            createdBy: req.userId
        });

        await newMovie.save();
        res.status(201).send({ message: "Movie added successfully", movie: newMovie });
    } catch (error) {
        res.status(400).send({ message: "Error adding movie", error: error.message });
    }
});

// Get all movies (READ)
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find().populate('createdBy', 'name email');
        res.status(200).send({ message: "Movies fetched successfully", movies });
    } catch (error) {
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
        res.status(500).send({ message: "Error fetching movie", error: error.message });
    }
});

// Get movies created by logged-in user
router.get("/my/movies", authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.find({ createdBy: req.userId });
        res.status(200).send({ message: "Your movies fetched successfully", movies });
    } catch (error) {
        res.status(500).send({ message: "Error fetching your movies", error: error.message });
    }
});

// Update a movie (UPDATE)
router.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        const movieId = req.params.id;
        const { title, genre, director, releaseYear, duration, rating, description, poster } = req.body;

        // Check if movie exists and belongs to the user
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        if (movie.createdBy.toString() !== req.userId) {
            return res.status(403).send({ message: "You can only update your own movies" });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            {
                title,
                genre,
                director,
                releaseYear,
                duration,
                rating,
                description,
                poster
            },
            { new: true, runValidators: true }
        );

        res.status(200).send({ message: "Movie updated successfully", movie: updatedMovie });
    } catch (error) {
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
        res.status(500).send({ message: "Error deleting movie", error: error.message });
    }
});

module.exports = router;