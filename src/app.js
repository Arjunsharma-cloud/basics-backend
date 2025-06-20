import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";


const app = express();
dotenv.config(); // now we can use .env 

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
})); 

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public")); // it will store all the files , photos in public folder
app.use(cookieParser()); 


// routes
import userrouter from "./routes/user.routes.js";

//routes declarations
app.use("/api/v1/users" , userrouter);

export default app; // or we can write export { app };