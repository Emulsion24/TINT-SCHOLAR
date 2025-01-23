import express from 'express';
import connectDB from './connectDB.js';
import auth from "./routes/auth.js"
import studentRoutes from "./routes/studentRoutes.js"
import teacherRoutes from "./routes/teacherRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";

import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT=5000;
const __dirname=path.resolve();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",auth)
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admin", adminRoutes);
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
    })
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server is Running on port 5000");
});


