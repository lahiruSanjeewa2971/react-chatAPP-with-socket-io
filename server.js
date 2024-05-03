import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from './routes/auth.routes.js';
import messageRoute from './routes/message.routes.js';
import userRoute from './routes/user.routes.js';

import connectToMongoDB from "./DB/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// const app = express();


dotenv.config();

const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//     res.send("Hello")
// })
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
app.use("/api/users", userRoute);

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on Port ${PORT}`);
})