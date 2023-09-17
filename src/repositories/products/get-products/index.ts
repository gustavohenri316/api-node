import { MongoClient } from "../../../database/mongo";
import { IGetProductsRepository } from "../../../controllers/products/get-products";
import { Products } from "../../../models/products";
import { ObjectId } from "mongodb";
import { User } from "../../../models/users";

export class MongoGetProductRepository implements IGetProductsRepository {
  async getProducts(page: number, itemsPerPage: number): Promise<Products[]> {
    const skip = (page - 1) * itemsPerPage;

    const products = await MongoClient.db
      .collection<Omit<Products, "id">>("products")
      .find({})
      .skip(skip)
      .limit(itemsPerPage)
      .toArray();

    return products.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }

  async getTotalItems(): Promise<number> {
    const totalItems = await MongoClient.db
      .collection("products")
      .countDocuments();

    return totalItems;
  }

  async getUserById(userId: ObjectId): Promise<User | null> {
    try {
      const user = await MongoClient.db
        .collection<User>("users")
        .findOne({ _id: userId });

      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}
