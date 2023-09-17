import { ObjectId } from "mongodb";

import {
  ICreateProductsRepository,
  CreateProductsParams,
} from "../../../controllers/products/create-products";

import { MongoClient } from "../../../database/mongo";
import { Products } from "../../../models/products";
export class MongoCreateProductsRepository
  implements ICreateProductsRepository
{
  async createProducts(params: CreateProductsParams): Promise<Products> {
    if (!params.image) {
      params.image = "teste";
    }

    const user = await MongoClient.db
      .collection("users")
      .findOne({ _id: new ObjectId(params.userWhoRegistered) });

    if (!user) {
      throw new Error("User not found");
    }

    const { insertedId } = await MongoClient.db
      .collection("products")
      .insertOne(params);

    const createdProduct = await MongoClient.db
      .collection<Omit<Products, "id">>("products")
      .findOne({ _id: insertedId });

    if (!createdProduct) {
      throw new Error("Product not created");
    }

    const { _id, ...rest } = createdProduct;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
