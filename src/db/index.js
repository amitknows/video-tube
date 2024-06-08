import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from 'express';

const app = express();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    app.get("/", (req, res) => {
      res.send("Server is ready");
    });
    console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host} `);
    
    
    
    //  (connectionInstance.connection.host)
  } catch (error) {
    console.log("MongoDB connection FAILED!!!", error);
    process.exit(1);
  }
};

export default connectDB;
