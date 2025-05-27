const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    director: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    description: { type: String, required: true },
    poster: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
}, {
    timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;