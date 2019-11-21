const mongoose = require('mongoose')

const Schema = mongoose.Schema

const movieSchema = new Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    times: { type: Array, required: true },
    links: { type: Array, required: true },
    poster: { type: String, required: true },
    overview: { type: String },
    rating: { type: String },
    genres: { type: Array }
})

let Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie;