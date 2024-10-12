import mongoose from "mongoose";



const url = "mongodb://127.0.0.1:27017/ChatApp";

const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);  // No need to pass options here
    
    console.log("Connected to MongoDB using mongoose");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err.message);
  }
};


export default connectUsingMongoose;
