const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    auth_return: { type: String },
    dates: [{
        type: Schema.Types.ObjectId,
        ref: 'Date'
    }],
    name: { type: String }
})

let User = mongoose.model('User', userSchema)

module.exports = User