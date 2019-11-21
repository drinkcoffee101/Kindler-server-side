const mongoose = require('mongoose')

const Schema = mongoose.Schema

const theaterSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    movies: [{
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    }]
})

let Theater = mongoose.model('Theater', theaterSchema)

module.exports = Theater;