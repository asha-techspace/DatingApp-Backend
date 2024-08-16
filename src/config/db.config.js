import mongoose from "mongoose";

const databaseConnection = () => {
    mongoose.connect(process.env.DATABASE_CONNECTION_URI)
    .then(res => console.log(`DATABASE CONNECTED SUCCESSFUL WITH ${res.connection.host}`))
    .catch(err => console.log(`DATABASE CONNECTION ERROR: ${err.message}`))
}

export default databaseConnection;