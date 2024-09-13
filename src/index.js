import app from "./app.js";
import dotenv from 'dotenv';
import databaseConnection from "./config/db.config.js";

dotenv.config({
    path: './.env'
});

// Connect to the database
databaseConnection();

// Set up the port from the .env file or use default
const port = process.env.PORT || 4000;

// Listen on the `server` instance, which includes both Express and Socket.io
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});
