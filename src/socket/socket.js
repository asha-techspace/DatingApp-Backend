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




// const userSocketMap = {}  // {userId: SocketId}
io.on("connection", (socket) => {
  socket.on("adduser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getusers", users);
  });
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    } else {
      console.error(`User with ID ${receiverId} not found`);
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getusers", users);
  });
});

export { io, app, server };
