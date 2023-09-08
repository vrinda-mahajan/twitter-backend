import { connectToDatabase } from "./db/connect"
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env file!");
    }
    console.log("Connecting to database...");
    await connectToDatabase(mongoUri);
    console.log("Connected to database!");
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();

