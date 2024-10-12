import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userName :{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
   timestamp:Date
})

export  default chatSchema ;