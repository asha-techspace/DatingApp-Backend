import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = new express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Pass Socket.IO instance to the routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  
  // Join a user room
  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined their room.`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});













 


export { io, app, server };
