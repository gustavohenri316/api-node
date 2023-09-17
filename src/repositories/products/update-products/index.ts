import { ObjectId } from "mongodb";
import {
  IUpdateProductsRepository,
  UpdateProductsParams,
} from "../../../controllers/products/update-products";
import { Products } from "../../../models/products";
import { MongoClient } from "../../../database/mongo";

export class MongoUpdateProductsRepository
  implements IUpdateProductsRepository
{
  async updateProducts(
    id: string,
    params: UpdateProductsParams
  ): Promise<Products> {
    await MongoClient.db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...params,
        },
      }
    );

    const Products = await MongoClient.db
      .collection<Omit<Products, "id">>("products")
      .findOne({ _id: new ObjectId(id) });

    if (!Products) {
      throw new Error("Products not updated");
    }

    const { _id, ...rest } = Products;

    return {
      id: _id.toHexString(),
      ...rest,
    };
  }
}
