import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv"

dotenv.config();

const connect_DB = async () => {
    try {
        const connectionInstance =
            await mongoose.connect(`${process.env.MONGO_URI}/
            ${process.env.DB_NAME}`);
        console.log("database is CONNECTED!!!! ");
        console.log(`DB HOST:${connectionInstance.connection.host} `);
    } catch (error) {
        console.log("ERROR IN CONNECTION FAILED", error);
        process.exit(1);
    }
};

export default connect_DB;
