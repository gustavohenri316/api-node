import { ObjectId } from "mongodb";
import {
  IUpdateRoleRepository,
  UpdateRoleParams,
} from "../../../controllers/roles/update-roles";
import { MongoClient } from "../../../database/mongo";
import { Role } from "../../../models/roles";

export class MongoUpdateRoleRepository implements IUpdateRoleRepository {
  async updateRole(id: string, params: UpdateRoleParams): Promise<Role> {
    await MongoClient.db.collection("roles").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...params,
        },
      }
    );

    const Role = await MongoClient.db
      .collection<Omit<Role, "id">>("roles")
      .findOne({ _id: new ObjectId(id) });

    if (!Role) {
      throw new Error("Role not updated");
    }

    const { _id, ...rest } = Role;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
