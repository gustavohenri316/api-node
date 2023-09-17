import { IGetUsersRepository } from "../../../controllers/users/get-users";
import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/users";

export class MongoGetUserRepository implements IGetUsersRepository {
  async getUsers(
    page: number,
    itemsPerPage: number
  ): Promise<{ users: User[]; totalItems: number }> {
    const skip = (page - 1) * itemsPerPage;
    const usersCursor = MongoClient.db
      .collection<Omit<User, "id">>("users")
      .find({});

    const totalItems = await usersCursor.count();

    const users = await usersCursor.skip(skip).limit(itemsPerPage).toArray();

    const usersWithId = users.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));

    return { users: usersWithId, totalItems };
  }
}
