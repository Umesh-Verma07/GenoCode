const mongoose = require('mongoose')
const {Schema} = mongoose;

const submissionSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    email:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    verdict:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('submission', submissionSchema);