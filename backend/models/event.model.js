const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Array },
    venue: { type: String },
    image: { type: String },
    address: { type: String },
    date: { type: String },
    type: { type: String }
})

let Event = mongoose.model('Event', eventSchema)

module.exports = Event;