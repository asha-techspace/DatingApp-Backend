import mongoose from "mongoose";

const databaseConnection = () => {
    mongoose.connect(process.env.DB_URL)
    .then(res => console.log(`DATABASE CONNECTED SUCCESSFUL WITH ${res.connection.host}`))
    .catch(err => console.log(`DATABASE CONNECTION ERROR: ${err.message}`))
}

export default databaseConnection;