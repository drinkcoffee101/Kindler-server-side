const mongoose = require('mongoose')

const Schema = mongoose.Schema

const resturantSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    times: { type: String, required: true },
    thumbnail: { type: String, required: true },
    rating: { type: String, required: true },
    food_photos: { type: Array },
    phone: { type: String },
    menu_link: { type: String },
    type: { type: String }
})

let Resturant = mongoose.model('Resturant', resturantSchema)

module.exports = Resturant;