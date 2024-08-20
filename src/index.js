import app from "./app.js";
import dotenv from 'dotenv';
import databaseConnection from "./config/db.config.js";
import { createClient } from 'redis';

dotenv.config({
    path: './.env'
});

databaseConnection();

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`server is up on port ${port}`)
})

