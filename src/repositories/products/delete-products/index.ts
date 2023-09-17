import { ObjectId } from "mongodb";
import { MongoClient } from "../../../database/mongo";
import { IDeleteProductsRepository } from "../../../controllers/products/delete-products";
import { Products } from "../../../models/products";

export class MongoDeleteProductsRepository
  implements IDeleteProductsRepository
{
  async deleteProducts(id: string): Promise<Products> {
    const Products = await MongoClient.db
      .collection<Omit<Products, "id">>("products")
      .findOne({ _id: new ObjectId(id) });

    if (!Products) {
      throw new Error("Products not found");
    }

    const { deletedCount } = await MongoClient.db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("Products not deleted");
    }

    const { _id, ...rest } = Products;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
