import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

// adding socket server on top of express server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ['GET', 'POST']
    }
});

// get user socket ID
export const getReceiverSockerId = (reveiverId) => {
    return userSocketMap[reveiverId];
}

const userSocketMap = {};

// listning to connections using socket io
// socket.on can be used to listen to the events
io.on('connection', (socket) => {
    console.log("a user connected. ", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != undefined) userSocketMap[userId] = socket.id;

    // send event to all connected clients
    // when user connects, this will immedeatly send who is online and who is not.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("user disconnected.", socket.id)
        // when disconnected, delete user from socket map and display user is offline.
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


export { app, io, server };