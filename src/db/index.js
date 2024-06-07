import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from 'express';

const app = express();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host} `);
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on localhost:${process.env.PORT}`);
    });
    //  (connectionInstance.connection.host)
  } catch (error) {
    console.log("MongoDB connection FAILED!!!", error);
    process.exit(1);
  }
};

export default connectDB;
