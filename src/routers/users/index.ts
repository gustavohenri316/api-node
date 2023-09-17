import { Router } from "express";
import { CreateUserController } from "../../controllers/users/create-users";
import { DeleteUserController } from "../../controllers/users/delete-users";
import { GetUsersController } from "../../controllers/users/get-users";
import { LoginController } from "../../controllers/users/login-users";
import { UpdateUserController } from "../../controllers/users/update-users";
import { MongoCreateUserRepository } from "../../repositories/users/create-users";
import { MongoDeleteUserRepository } from "../../repositories/users/delete-users";
import { MongoGetUserRepository } from "../../repositories/users/get-users";
import { MongoLoginRepository } from "../../repositories/users/login-users";
import { MongoUpdateUserRepository } from "../../repositories/users/update-users";

const UserRouter = Router();

UserRouter.get("/users", async (req, res) => {
  const mongoGetUserRepository = new MongoGetUserRepository();
  const getUsersController = new GetUsersController(mongoGetUserRepository);
  const { body, statusCode } = await getUsersController.handle();
  res.status(statusCode).send(body);
});

UserRouter.post("/users", async (req, res) => {
  const mongoCreateUserRepository = new MongoCreateUserRepository();
  const createUserController = new CreateUserController(
    mongoCreateUserRepository
  );
  const { body, statusCode } = await createUserController.handle({
    body: req.body,
  });
  res.status(statusCode).send(body);
});

UserRouter.patch("/users/:id", async (req, res) => {
  const mongoUpdateUserRepository = new MongoUpdateUserRepository();
  const updateUserController = new UpdateUserController(
    mongoUpdateUserRepository
  );
  const { body, statusCode } = await updateUserController.handle({
    body: req.body,
    params: req.params,
  });
  res.status(statusCode).send(body);
});

UserRouter.delete("/users/:id", async (req, res) => {
  const mongoDeleteUserRepository = new MongoDeleteUserRepository();
  const deleteUserController = new DeleteUserController(
    mongoDeleteUserRepository
  );
  const { body, statusCode } = await deleteUserController.handle({
    params: req.params,
  });
  res.status(statusCode).send(body);
});

UserRouter.post("/login", async (req, res) => {
  const mongoLoginRepository = new MongoLoginRepository();
  const loginController = new LoginController(mongoLoginRepository);
  const { body, statusCode } = await loginController.handle({
    body: req.body,
  });
  res.status(statusCode).send(body);
});

export default UserRouter;
