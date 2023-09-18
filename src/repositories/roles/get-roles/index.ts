import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { Role } from "../../../models/roles";
import { IGetRolesRepository } from "../../../controllers/roles/get-roles";

export class MongoGetRoleRepository implements IGetRolesRepository {
  async getRoles(
    page: number,
    itemsPerPage: number,
    search?: string
  ): Promise<{ roles: Role[]; totalItems: number }> {
    const skip = (page - 1) * itemsPerPage;
    const query: {
      [key: string]: RegExp;
    }[] = [];

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.push(
        { id: searchRegex },
        { name: searchRegex },
        { description: searchRegex },
        { createdBy: searchRegex }
      );
    } else {
      query.push({});
    }

    const collection = MongoClient.db.collection<Role>("roles");
    const totalItems = await collection.countDocuments({ $or: query });

    const RolesCursor = collection
      .find({ $or: query })
      .skip(skip)
      .limit(itemsPerPage);

    const Roles = await RolesCursor.toArray();

    const RolesWithId = Roles.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));

    return { roles: RolesWithId, totalItems };
  }

  async getRoleById(RoleId: string): Promise<Role | null> {
    try {
      const collection = MongoClient.db.collection<Role>("roles");
      const Role = await collection.findOne({ _id: new ObjectId(RoleId) });

      if (Role) {
        return { ...Role, id: Role._id.toHexString() };
      }

      return null;
    } catch (error) {
      throw new Error("Error fetching Role by ID");
    }
  }
}
