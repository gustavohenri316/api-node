import { IGetUsersRepository } from "../../../controllers/users/get-users/protocols";
import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/users";

export class MongoGetUserRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    const users = await MongoClient.db
      .collection<Omit<User, "id">>("users")
      .find({})
      .toArray();

    return users.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }
}
