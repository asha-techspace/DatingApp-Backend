import { Server } from "socket.io";

const io = new Server(8800, {
  cors: {
    origin:  ["http://localhost:5173", "http://localhost:5000"],
    methods: ["GET", "POST"],
  },
});

let activeUsers = [];
const users = {};

io.on("connection", (socket) => {


    console.log('A user connected', socket.id);

    // Join the socket room specific to the user
    socket.on('joinRoom', (userId) => {
      socket.join(userId); // userId is the unique identifier for the user
      console.log(`User with ID ${userId} joined room ${userId}`);
    });

    socket.on('joinRoom', (userId) => {
      if (userId) {
        // Store the mapping of userId to the current socket.id
        users[userId] = socket.id;
        socket.join(userId); // User joins a room based on their userId
        console.log(`User with ID ${userId}-${socket.id} joined room ${userId}`);
      }
    });

  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  
  });

  //send notification
  socket.on('sendNotification', ({ from, to, type }) => {
    if (users[to]) {
      io.to(users[to]).emit('newNotification', {
        type,
        sender: from,
        receiver: to,
      });
      console.log(`Notification sent from ${from} to ${to}`);
    }
  });
  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});
