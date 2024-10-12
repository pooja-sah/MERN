import chatSchema from "./chat.schema.js";
import mongoose from "mongoose";

// Creating a model for chat schema
const Chatmodel = mongoose.model('chat', chatSchema);

function NewChat(userName, Message, Timestamp) {
    // Creating a new chat instance with the necessary fields
    const userChat = new Chatmodel({
        userName: userName, 
        message: Message,   
        timestamp: Timestamp 
    });
    
    // Saving the new chat entry to the database
    return userChat.save();
}

async function oldMessage(userName) {
    try {
        const chat = await Chatmodel.find({ userName: userName }) // Filter by userName
            .sort({ timestamp: 1 }) // Sort in descending order
            .limit(50); // Limit to the last 50 messages
            console.log(chat);
        return chat; // Return the retrieved messages

    } catch (error) {
        console.error("Error fetching old messages:", error);
        throw error; // Optionally throw the error for further handling
    }
}


export  {NewChat,  oldMessage};

