import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./config/db.config.js";
import authRoutes from './routes/auth.routers.js';
dotenv.config({
    path: './.env'
});
// const app = express();
// app.use(express.json());

        await connectDB();
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

