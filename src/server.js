import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandler.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_KEY);

mongoose.connection.on("connected", () => {
  console.log("Connected!!!!!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});