import express from "express";
import { config } from "dotenv";
import { GetUsersController } from "./controllers/users/get-users";
import { MongoGetUserRepository } from "./repositories/users/get-users/mongo-get-users";
import { MongoClient } from "./database/mongo";
import { MongoCreateUserRepository } from "./repositories/users/create-users/mongo-create-users";
import { CreateUserController } from "./controllers/users/create-users";

const main = async () => {
  config();
  const app = express();
  app.use(express.json());
  await MongoClient.connect();

  app.get("/users", async (req, res) => {
    const mongoGetUserRepository = new MongoGetUserRepository();
    const getUsersController = new GetUsersController(mongoGetUserRepository);
    const { body, statusCode } = await getUsersController.handle();
    res.status(statusCode).send(body);
  });
  app.post("/users", async (req, res) => {
    const mongoCreateUserRepository = new MongoCreateUserRepository();
    const createUserController = new CreateUserController(
      mongoCreateUserRepository
    );
    const { body, statusCode } = await createUserController.handle({
      body: req.body,
    });
    res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log("listening on port " + port));
};
main();
