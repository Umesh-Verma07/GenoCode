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
        required: true,
        index : true
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
        default: Date.now
    }
})

submissionSchema.index({ email: 1, date: -1 });
submissionSchema.index({ problemId: 1, date: -1 });
submissionSchema.index({ language: 1, date: -1 });

module.exports = mongoose.model('submission', submissionSchema);