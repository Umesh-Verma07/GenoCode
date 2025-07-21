const mongoose = require('mongoose')
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type : String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    institute: {
        type: String
    },
    location:{
        type: String
    },
    skills:{
        type: [String]
    },
    image:{
        type:String
    },
    rank:{
        type: Number
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('user', userSchema);