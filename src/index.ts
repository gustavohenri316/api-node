import express from "express";
import { config } from "dotenv";
import { GetUsersController } from "./controllers/users/get-users";
import { MongoGetUserRepository } from "./repositories/users/get-users/mongo-get-users";
import { MongoClient } from "./database/mongo";

const main = async () => {
  config();
  const app = express();
  await MongoClient.connect();

  app.get("/users", async (req, res) => {
    const mongoGetUserRepository = new MongoGetUserRepository();
    const getUsersController = new GetUsersController(mongoGetUserRepository);
    const { body, statusCode } = await getUsersController.handle();
    res.send(body).status(statusCode);
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log("listening on port " + port));
};
main();
