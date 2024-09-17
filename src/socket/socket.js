import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = new express();
const server = http.createServer(app);

// CORS middleware for Express
app.use(
  cors({
    origin: "http://localhost:5173",  // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true                 // Allow cookies and credentials
  })
);

// Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(user => user.userId === userId);
};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    removeUser(socket.id);
  });
});

export { io, app, server };
