const mongoose = require('mongoose')
const {Schema} = mongoose;

const TestCaseSchema = new Schema({
    input: { 
        type: String, 
        required: true 
    },
    output: { 
        type: String, 
        required: true }
}, { _id: false });

const ProblemSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    testCases: {
        type: [TestCaseSchema],
        required: true,
    },
    tags: {
        type: [String]
    },
    email:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports =  mongoose.model('Problem', ProblemSchema);
