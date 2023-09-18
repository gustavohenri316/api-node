import { Router } from "express";
import { CreatePermissionsController } from "../../controllers/permissions/create-permissions";
import { MongoCreatePermissionsRepository } from "../../repositories/permissions/create-permissions";

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

export default PermissionRouter;
