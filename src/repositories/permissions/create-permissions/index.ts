import {
  ICreatePermissionsRepository,
  CreatePermissionsParams,
} from "../../../controllers/permissions/create-permissions";
import { MongoClient } from "../../../database/mongo";
import { Permission } from "../../../models/permissions";
import { v4 as uuid } from "uuid";

export class MongoCreatePermissionsRepository
  implements ICreatePermissionsRepository
{
  async createPermissions(
    params: CreatePermissionsParams
  ): Promise<Permission> {
    const { userId, title, description } = params;

    const PermissionToCreate = {
      title,
      description,
      createdAt: new Date(),
      createdBy: userId,
      key: uuid(),
    };

    const { insertedId } = await MongoClient.db
      .collection("permissions")
      .insertOne(PermissionToCreate);

    const createdPermission = await MongoClient.db
      .collection<Omit<Permission, "id">>("permissions")
      .findOne({ _id: insertedId });

    if (!createdPermission) {
      throw new Error("Permission not created");
    }

    const { _id, ...rest } = createdPermission;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
