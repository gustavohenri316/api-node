import { avatarUrl } from "../../../assets/data";
import {
  ICreateUserRepository,
  CreateUserParams,
} from "../../../controllers/users/create-users";

import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/users";

export class MongoCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    if (!params.avatar_url) {
      params.avatar_url = avatarUrl;
    }
    params.isActive = true;

    const { insertedId } = await MongoClient.db
      .collection("users")
      .insertOne(params);
    const user = await MongoClient.db
      .collection<Omit<User, "id">>("users")
      .findOne({ _id: insertedId });

    if (!user) {
      throw new Error("User not created");
    }

    const { _id, ...rest } = user;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
