import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import databaseConnection from "./config/db.config.js";
import passport from './middlewares/passport.middleWare.js'
import session from "express-session";
import authRoutes from "./routes/auth.routers.js"
import locationRouter from "./routes/location.routers.js"
import chatRoutes from "./routes/chat.routes.js"
import messageRoutes from "./routes/message.routes.js"
import dotenv from 'dotenv'
import {getStories, oneStory} from "./controllers/stories/stories.controller.js";

dotenv.config()
const app = express();
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
app.use("/location", locationRouter)
app.use("/chat",chatRoutes)
app.use("/message", messageRoutes)

// get user stories
app.get("/story/:id", oneStory)
app.get("/story", getStories)



export default app