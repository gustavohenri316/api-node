import { ObjectId } from "mongodb";
import { Products } from "../../../models/products";
import { error, success } from "../../helpers";
import { IController, HttpRequest, HttpResponse } from "../../protocols";
import { User } from "../../../models/users";

interface ProductsWithUser {
  id: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
  category: string;
  supplier: string;
  userWhoRegistered: string;
  user: {
    id: string;
    name: string;
  };
}

export interface IGetProductsRepository {
  getProducts(page: number, itemsPerPage: number): Promise<Products[]>;
  getTotalItems(): Promise<number>;
  getUserById(userId: ObjectId): Promise<User | null>;
}

export class GetProductsController implements IController {
  constructor(private readonly getProductsRepository: IGetProductsRepository) {}

  async handle(
    httpRequest: HttpRequest<{ page: number; itemsPerPage: number }>
  ): Promise<
    HttpResponse<{
      data: ProductsWithUser[];
      page: number;
      itemsPerPage: number;
      totalItems: number;
    }>
  > {
    try {
      const { page, itemsPerPage } = httpRequest.params || {
        page: 1,
        itemsPerPage: 10,
      };

      const products = await this.getProductsRepository.getProducts(
        page,
        itemsPerPage
      );

      const totalItems = await this.getProductsRepository.getTotalItems();

      const productsWithUser: ProductsWithUser[] = [];

      for (const product of products) {
        const user = await this.getProductsRepository.getUserById(
          new ObjectId(product.userWhoRegistered)
        );

        if (user) {
          const name = `${user.firstName} ${user.lastName}`;
          const productWithUser: ProductsWithUser = {
            id: product.id,
            description: product.description,
            quantity: product.quantity,
            price: product.price,
            image: product.image,
            category: product.category,
            supplier: product.supplier,
            userWhoRegistered: product.userWhoRegistered,
            user: {
              id: user.id,
              name,
            },
          };

          productsWithUser.push(productWithUser);
        }
      }

      return success({
        page,
        itemsPerPage,
        totalItems,
        data: productsWithUser,
      });
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
