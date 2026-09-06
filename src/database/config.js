const mongoose = require("mongoose");

const connectDB = async () => {

    try {

        await mongoose.connect(
            "mongodb+srv://keerthiga:keerthi15j@cluster0.06b7vqp.mongodb.net/?appName=Cluster0"
        );

        console.log("Database connected!!");

    } catch (error) {

        console.log(error.message);

    }

};

module.exports = connectDB;