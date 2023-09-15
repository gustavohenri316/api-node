import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/users";

export interface ILoginRepository {
  getUserByEmail(email: string): Promise<User | null>;
}

export class MongoLoginRepository implements ILoginRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await MongoClient.db
      .collection<User>("users")
      .findOne({ email });

    return user || null;
  }
}
