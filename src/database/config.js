// const mongoose = require("mongoose");

// const connectDB = async () => {

//     try {

//         await mongoose.connect(
//             "mongodb+srv://keerthiga:keerthi15j@cluster0.06b7vqp.mongodb.net/?appName=Cluster0"
//         );

//         console.log("Database connected!!");

//     } catch (error) {

//         console.log(error.message);

//     }

// };

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;