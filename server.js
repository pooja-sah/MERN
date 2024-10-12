import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import connectUsingMongoose from './mongoose.js';
import {NewChat, oldMessage} from './chat.model.js';

const App = express();

// Create HTTP server
const server = http.createServer(App);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Use the IO events
io.on('connection', (socket) => {
    console.log('A client connected');

    // Handle when a user joins the chat
    socket.on('join', (userName) => {
        socket.userName = userName;
        console.log(`${userName} joined the chat.`);
        socket.on('old_messages', async (userName) => {
        try {
            const messages = await oldMessage(userName); // Fetch messages
            socket.emit('old_message', messages); // Emit the retrieved messages to the client
            console.log(messages);
        } catch (error) {
            socket.emit('error', { message: 'Failed to fetch old messages.' }); // Handle errors by notifying the client
        }
    });
    
    });

    // Handle new messages
    socket.on('new_message', async (message) => {
        const messageUserName = {
            userName: socket.userName, // Use the stored userName from the "join" event
            message: message
        };
        
        // Save the chat to the database
        try {
            const timestamp = new Date(); // Use current time as the timestamp
            await NewChat(socket.userName, message, timestamp);
        } catch (error) {
            console.error('Error saving chat to database:', error);
        }

        // Broadcast the message to all clients except the sender
        socket.broadcast.emit('broadcast_message', messageUserName);
    });

    // Handle when a user disconnects
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Start the server and connect to the database
server.listen(3000, () => {
    console.log('Listening on *:3000');
    connectUsingMongoose();
});
