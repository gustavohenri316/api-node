import { MongoClient } from "../../../database/mongo";
import { Products } from "../../../models/products";
import { ObjectId } from "mongodb";
import { User } from "../../../models/users";
import { IGetProductsRepository } from "../../../controllers/products/get-products";

interface ProductFilters {
  id?: string;
  description?: string;
  category?: string;
  supplier?: string;
  userWhoRegistered?: string;
}

interface QueryFilter {
  [key: string]: string | ObjectId | RegExp;
}

export class MongoGetProductRepository implements IGetProductsRepository {
  async getProducts(
    page: number,
    itemsPerPage: number,
    filters: ProductFilters
  ): Promise<Products[]> {
    const skip = (page - 1) * itemsPerPage;

    const queryFilter: QueryFilter = {};

    if (filters.id) {
      queryFilter._id = new ObjectId(filters.id);
    }
    if (filters.description) {
      queryFilter.description = new RegExp(filters.description, "i");
    }
    if (filters.category) {
      queryFilter.category = filters.category;
    }
    if (filters.supplier) {
      queryFilter.supplier = new RegExp(filters.supplier, "i");
    }
    if (filters.userWhoRegistered) {
      queryFilter.userWhoRegistered = filters.userWhoRegistered;
    }

    const products = await MongoClient.db
      .collection<Omit<Products, "id">>("products")
      .find(queryFilter)
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
