const mongoose = require('mongoose')
const {Schema} = mongoose;

const submissionSchema = new Schema({
    problemId: {
        type: String,
        required: true
    },
    problemName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true,
    },
    level:{
        type: String,
        default: "Medium"
    },
    language:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('submission', submissionSchema);