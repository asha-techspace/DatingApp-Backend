import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import databaseConnection from "./config/db.config.js";
import passport from './middlewares/passport.middleWare.js'
import session from "express-session";
import authRoutes from "./routes/auth.routers.js"
import dotenv from 'dotenv'
dotenv.config()

const app = new express();
// dotenv

databaseConnection();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


// Configure session middleware
app.use(
  session({
    secret: "upbwgfqrgtiqpfvqeig330iv39buiv", // replace with your secret key
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // save uninitialized sessions
    cookie: { secure: false }, // set to true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(authUser))

// routes
app.use("/", authRoutes)
app.use("/api/v1/users", userRoute);



export default app