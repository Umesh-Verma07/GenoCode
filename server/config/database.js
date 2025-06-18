const mongoose = require('mongoose')

const mongoDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL).then(()=> console.log("Database connected"));
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = mongoDb;