const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    auth_return: { Type: String },
    dates: [{
        type: Schema.Types.ObjectId,
        ref: 'Date'
    }],
    name: { Type: String }
})

let User = mongoose.model('User', userSchema)

module.exports = User