import { Router } from "express";
import { CreateRolesController } from "../../controllers/roles/create-roles";
import { MongoCreateRolesRepository } from "../../repositories/roles/create-roles";
import { GetRolesController } from "../../controllers/roles/get-roles";
import { MongoGetRoleRepository } from "../../repositories/roles/get-roles";

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

RoleRouter.get("/roles", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
  const search = req.query.search as string | undefined;
  const mongoGetRoleRepository = new MongoGetRoleRepository();
  const getRolesController = new GetRolesController(mongoGetRoleRepository);

  const { body, statusCode } = await getRolesController.handle({
    params: { page, itemsPerPage, search },
  });

  res.status(statusCode).send(body);
});

export default RoleRouter;
