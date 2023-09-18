import express from "express";
import { config } from "dotenv";
import { MongoClient } from "./database/mongo";

import UserRouter from "./routers/users";
import ProductRouter from "./routers/products";
import RolesRouter from "./routers/roles";
import PermissionRouter from "./routers/permissions";

const main = async () => {
  config();
  const app = express();
  app.use(express.json());
  await MongoClient.connect();

  app.use("/api", [UserRouter, ProductRouter, RolesRouter, PermissionRouter]);

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log("listening on port " + port));
};
main();
