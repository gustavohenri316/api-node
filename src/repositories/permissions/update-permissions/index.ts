import { ObjectId } from "mongodb";

import { MongoClient } from "../../../database/mongo";
import {
  IUpdatePermissionRepository,
  UpdatePermissionParams,
} from "../../../controllers/permissions/update-permissions";
import { Permission } from "../../../models/permissions";

export class MongoUpdatePermissionRepository
  implements IUpdatePermissionRepository
{
  async updatePermission(
    id: string,
    params: UpdatePermissionParams
  ): Promise<Permission> {
    await MongoClient.db.collection("permissions").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...params,
        },
      }
    );

    const Permission = await MongoClient.db
      .collection<Omit<Permission, "id">>("permissions")
      .findOne({ _id: new ObjectId(id) });

    if (!Permission) {
      throw new Error("Permission not updated");
    }

    const { _id, ...rest } = Permission;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
