import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
    input: { 
        type: String, 
        required: true 
    },
    output: { 
        type: String, 
        required: true }
}, { _id: false });

const ProblemSchema = new mongoose.Schema({
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
    }
});

export default mongoose.model('Problem', ProblemSchema);
