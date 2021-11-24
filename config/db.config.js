const mongoose = require("mongoose")

const connectDB = async () => {

    const mongoURI = process.env.MONGO_URI

    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log("Mongo DB Connected");
}

module.exports = connectDB