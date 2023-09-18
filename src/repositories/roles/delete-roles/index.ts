import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { Role } from "../../../models/roles";
import { IDeleteRoleRepository } from "../../../controllers/roles/delete-roles";

export class MongoDeleteRoleRepository implements IDeleteRoleRepository {
  async deleteRole(id: string): Promise<Role> {
    const Role = await MongoClient.db
      .collection<Omit<Role, "id">>("roles")
      .findOne({ _id: new ObjectId(id) });

    if (!Role) {
      throw new Error("Role not found");
    }

    const { deletedCount } = await MongoClient.db
      .collection("roles")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("Role not deleted");
    }

    const { _id, ...rest } = Role;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
