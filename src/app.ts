import { connectToDatabase } from "./db/connect";
import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded, json } from "express";
const app = express();
import * as swaggerUI from "swagger-ui-express";
import * as swaggerJson from "./tsoa/tsoa.json";

app.use(
  ["/openapi", "/docs", "/swagger"],
  swaggerUI.serve,
  swaggerUI.setup(swaggerJson)
);
app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/swagger.json", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(__dirname + "/tsoa/tsoa.json");
});

import { RegisterRoutes } from "./routes/routes";
RegisterRoutes(app);

import { errorMiddlewareHandler } from "./middleware/error-handler";
app.use(errorMiddlewareHandler);

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
