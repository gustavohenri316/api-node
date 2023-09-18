import { Router } from "express";
import { CreateRolesController } from "../../controllers/roles/create-roles";
import { MongoCreateRolesRepository } from "../../repositories/roles/create-roles";
import { GetRolesController } from "../../controllers/roles/get-roles";
import { MongoGetRoleRepository } from "../../repositories/roles/get-roles";
import { UpdateRoleController } from "../../controllers/roles/update-roles";
import { MongoUpdateRoleRepository } from "../../repositories/roles/update-roles";
import { DeleteRoleController } from "../../controllers/roles/delete-roles";
import { MongoDeleteRoleRepository } from "../../repositories/roles/delete-roles";

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

RoleRouter.patch("/roles/:id", async (req, res) => {
  const mongoUpdateRoleRepository = new MongoUpdateRoleRepository();
  const updateRoleController = new UpdateRoleController(
    mongoUpdateRoleRepository
  );
  const { body, statusCode } = await updateRoleController.handle({
    body: req.body,
    params: req.params,
  });
  res.status(statusCode).send(body);
});

RoleRouter.delete("/roles/:id", async (req, res) => {
  const mongoDeleteRoleRepository = new MongoDeleteRoleRepository();
  const deleteRoleController = new DeleteRoleController(
    mongoDeleteRoleRepository
  );
  const { body, statusCode } = await deleteRoleController.handle({
    params: req.params,
  });
  res.status(statusCode).send(body);
});

export default RoleRouter;
