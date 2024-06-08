
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

import connectDB from "./db/index.js";
import express from 'express'

const app =express()



connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000, () => {
    console.log(` 🛠️  App is listening on localhost:${process.env.PORT}`);
  });
})
.catch((error)=>{
  console.log('MongoDB connection FAILED!!!!', error)
})





















/*
import express from "express";

const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("errr:", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("error", error);
    throw err;
  }
})();
*/