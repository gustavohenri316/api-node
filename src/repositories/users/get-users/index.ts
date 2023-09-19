import { ObjectId } from "mongodb";
import { IGetUsersRepository } from "../../../controllers/users/get-users";
import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/users";
import { Role } from "../../../models/roles";
import { Permission } from "../../../models/permissions";

export class MongoGetUserRepository implements IGetUsersRepository {
  async getUsers(
    page: number,
    itemsPerPage: number,
    search?: string
  ): Promise<{ users: User[]; totalItems: number }> {
    const skip = (page - 1) * itemsPerPage;
    const query: {
      [key: string]: RegExp;
    }[] = [];

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.push(
        { id: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      );
    } else {
      query.push({});
    }

    const collection = MongoClient.db.collection<User>("users");
    const totalItems = await collection.countDocuments({ $or: query });
    const usersCursor = collection
      .find({ $or: query })
      .skip(skip)
      .limit(itemsPerPage);

    const users = await usersCursor.toArray();
    const usersWithId = users.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));

    return { users: usersWithId, totalItems };
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const collection = MongoClient.db.collection<User>("users");
      const user = await collection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } }
      );

      if (user) {
        return { ...user, id: user._id.toHexString() };
      }
      return null;
    } catch (error) {
      throw new Error("Error fetching user by ID");
    }
  }

  async getRolesForUser(userId: string): Promise<Role | null> {
    try {
      const collection = MongoClient.db.collection<Role>("roles");
      const roles = await collection.findOne({ _id: new ObjectId(userId) });
      return roles || null;
    } catch (error) {
      throw new Error("Erro ao buscar as roles do usuário");
    }
  }

  async getPermissionsForUser(userIds: string[]): Promise<Permission[]> {
    try {
      const userIdObjects = userIds.map((userId) => new ObjectId(userId));
      const collection = MongoClient.db.collection<Permission>("permissions");
      const permissions = await collection
        .find({ _id: { $in: userIdObjects } })
        .toArray();

      return permissions;
    } catch (error) {
      throw new Error("Erro ao buscar as permissões do usuário");
    }
  }
}
