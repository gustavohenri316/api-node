import express from "express";
import { config } from "dotenv";
import { MongoClient } from "./database/mongo";
import i18n from "./i18n";

import UserRouter from "./routers/users";
import ProductRouter from "./routers/products";
import RolesRouter from "./routers/roles";
import PermissionRouter from "./routers/permissions";

const main = async () => {
  config();
  const app = express();
  app.use(express.json());
  app.use(i18n.init);
  app.use((req, res, next) => {
    const acceptLanguage = req.header("accept-Language") || "en";
    i18n.setLocale(acceptLanguage);
    next();
  });

  await MongoClient.connect();
  app.use("/api", [UserRouter, ProductRouter, RolesRouter, PermissionRouter]);
  app.get("/", async (req, res) => {
    res.send({ name: res.__("something.went.wrong") });
  });
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log("listening on port " + port));
};
main();
