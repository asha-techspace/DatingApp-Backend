// import app from "./app.js";
import dotenv from 'dotenv';
import databaseConnection from "./config/db.config.js";
import { server } from "./socket/socket.js";

dotenv.config({
    path: './.env'
});

databaseConnection();

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`server is up on port ${port}`)
})

