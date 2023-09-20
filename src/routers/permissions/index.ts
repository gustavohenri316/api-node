import { Router } from "express";
import { CreatePermissionsController } from "../../controllers/permissions/create-permissions";
import { MongoCreatePermissionsRepository } from "../../repositories/permissions/create-permissions";
import { GetPermissionsController } from "../../controllers/permissions/get-permissions";
import { MongoGetPermissionRepository } from "../../repositories/permissions/get-permissions";
import { UpdatePermissionController } from "../../controllers/permissions/update-permissions";
import { MongoUpdatePermissionRepository } from "../../repositories/permissions/update-permissions";

const PermissionRouter = Router();

PermissionRouter.post("/permissions", async (req, res) => {
  const mongoCreatePermissionsRepository =
    new MongoCreatePermissionsRepository();
  const createPermissionsController = new CreatePermissionsController(
    mongoCreatePermissionsRepository
  );
  const { body, statusCode } = await createPermissionsController.handle({
    body: req.body,
  });
  res.status(statusCode).send(body);
});

PermissionRouter.get("/permissions", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
  const search = req.query.search as string | undefined;
  const mongoGetPermissionRepository = new MongoGetPermissionRepository();
  const getPermissionsController = new GetPermissionsController(
    mongoGetPermissionRepository
  );
  const { body, statusCode } = await getPermissionsController.handle({
    params: { page, itemsPerPage, search },
  });
  res.status(statusCode).send(body);
});

PermissionRouter.patch("/permissions/:id", async (req, res) => {
  const mongoUpdatePermissionRepository = new MongoUpdatePermissionRepository();
  const updatePermissionController = new UpdatePermissionController(
    mongoUpdatePermissionRepository
  );
  const { body, statusCode } = await updatePermissionController.handle({
    body: req.body,
    params: req.params,
  });
  res.status(statusCode).send(body);
});

export default PermissionRouter;
