import { Router } from "express";
import { CreateRolesController } from "../../controllers/roles/create-roles";
import { MongoCreateRolesRepository } from "../../repositories/roles/create-roles";

const RoleRouter = Router();

RoleRouter.post("/roles", async (req, res) => {
  const mongoCreateRolesRepository = new MongoCreateRolesRepository();
  const createRolesController = new CreateRolesController(
    mongoCreateRolesRepository
  );
  const { body, statusCode } = await createRolesController.handle({
    body: req.body,
  });
  res.status(statusCode).send(body);
});

export default RoleRouter;
