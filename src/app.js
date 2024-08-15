import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import userRoute from './routes/user.routes.js'

const app = new express();

app.use(cors({
    origin: 'http://localhost:5173',
    Credential: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

// routes
app.use('/api/v1/users', userRoute)

export default app;