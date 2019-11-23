const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dateSchema = new Schema({
    resturants: {
        type: Schema.Types.ObjectId,
        ref: 'Resturant'
    },
    movies: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },
    events: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }
})

let UserDate = mongoose.model('Date', dateSchema)

module.exports = UserDate