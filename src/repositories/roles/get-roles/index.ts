import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { Role } from "../../../models/roles";
import { IGetRolesRepository } from "../../../controllers/roles/get-roles";
import { User } from "../../../models/users";
import isValidObjectId from "bson-objectid";

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
        { title: searchRegex },
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

    const rolesWithUserInfo = await RolesCursor.toArray();

    const rolesWithoutId = rolesWithUserInfo.map((role) => {
      const { _id, ...rest } = role;
      return { ...rest, id: _id.toHexString() };
    });

    for (let i = 0; i < rolesWithoutId.length; i++) {
      const role = rolesWithoutId[i];
      if (isValidObjectId(role.createdBy as unknown as string)) {
        const userInfo = await this.getUserInfo(
          role.createdBy as unknown as string
        );

        const createdBy: {
          firstName: string;
          lastName: string;
          email: string;
        } = userInfo || { firstName: "", lastName: "", email: "" };

        rolesWithoutId[i].createdBy = createdBy;
      } else {
        console.error("Invalid userId:", role.createdBy);
      }
    }

    return { roles: rolesWithoutId, totalItems };
  }

  async getRoleById(roleId: string): Promise<Role | null> {
    try {
      const role = await MongoClient.db
        .collection<Role>("roles")
        .findOne({ _id: new ObjectId(roleId) }, { projection: { _id: 0 } });

      if (role) {
        console.log(role);
        return { ...role, id: roleId };
      }

      return null;
    } catch (error) {
      throw new Error("Error fetching Role by ID");
    }
  }

  async getUserInfo(
    userId: string
  ): Promise<{ firstName: string; lastName: string; email: string } | null> {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        return null;
      }
      const collection = MongoClient.db.collection<Omit<User, "id">>("users");
      const userInfo = await collection.findOne({ _id: new ObjectId(userId) });
      if (userInfo) {
        return {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching user information by userId:", error);
      return null;
    }
  }
}
