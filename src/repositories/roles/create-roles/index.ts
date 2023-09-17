import {
  ICreateRolesRepository,
  CreateRolesParams,
} from "../../../controllers/roles/create-roles";
import { MongoClient } from "../../../database/mongo";
import { Role } from "../../../models/roles";

export class MongoCreateRolesRepository implements ICreateRolesRepository {
  async createRoles(params: CreateRolesParams): Promise<Role> {
    const userId = params.userId;

    const roleToCreate = {
      title: params.title,
      description: params.description,
      createdAt: new Date(),
      createdBy: userId,
    };

    const { insertedId } = await MongoClient.db
      .collection("roles")
      .insertOne(roleToCreate);

    const createdRole = await MongoClient.db
      .collection<Omit<Role, "id">>("roles")
      .findOne({ _id: insertedId });

    if (!createdRole) {
      throw new Error("Role not created");
    }

    const { _id, ...rest } = createdRole;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
