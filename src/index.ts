import express from "express";
import { config } from "dotenv";
import { MongoClient } from "./database/mongo";
import UserRouter from "./routers/users";
import ProductRouter from "./routers/products";

const main = async () => {
  config();
  const app = express();
  app.use(express.json());
  await MongoClient.connect();

  app.use("/api", [UserRouter, ProductRouter]);

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log("listening on port " + port));
};
main();
