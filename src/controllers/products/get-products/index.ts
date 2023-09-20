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
    id: string | null;
    email: string | null;
    name: string | null;
  };
}

export interface IGetProductsRepository {
  getProducts(
    page: number,
    itemsPerPage: number,
    filters: {
      id?: string;
      description?: string;
      category?: string;
      supplier?: string;
      userWhoRegistered?: string;
    }
  ): Promise<Products[]>;
  getTotalItems(): Promise<number>;
  getUserById(userId: ObjectId): Promise<User | null>;
}

export class GetProductsController implements IController {
  constructor(private readonly getProductsRepository: IGetProductsRepository) {}

  async handle(
    httpRequest: HttpRequest<{
      page?: number;
      itemsPerPage?: number;
      query?: {
        id?: string;
        description?: string;
        category?: string;
        supplier?: string;
        userWhoRegistered?: string;
      };
    }>
  ): Promise<
    HttpResponse<{
      data: ProductsWithUser[];
      page: number;
      itemsPerPage: number;
      totalItems: number;
    }>
  > {
    try {
      const {
        page = 1,
        itemsPerPage = 10,
        query = {},
      } = httpRequest.params || {};

      const { data, totalItems } = await this.retrieveData(
        page,
        itemsPerPage,
        query
      );

      return success({
        page,
        itemsPerPage,
        totalItems,
        data,
      });
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }

  private async retrieveData(
    page: number,
    itemsPerPage: number,
    query: {
      id?: string;
      description?: string;
      category?: string;
      supplier?: string;
      userWhoRegistered?: string;
    }
  ): Promise<{ data: ProductsWithUser[]; totalItems: number }> {
    const products = await this.getProductsRepository.getProducts(
      page,
      itemsPerPage,
      query
    );

    const userIds = products.map(
      (product) => new ObjectId(product.userWhoRegistered)
    );
    const users = await Promise.all(
      userIds.map((userId) => this.getProductsRepository.getUserById(userId))
    );

    const productsWithUser: ProductsWithUser[] = [];

    console.log(products);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const user = users[i];

      const name = user ? `${user.firstName} ${user.lastName}` : null;
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
          id: user ? user.id : null,
          email: user ? user.email : null,
          name,
        },
      };

      productsWithUser.push(productWithUser);
    }

    const totalItems = await this.getProductsRepository.getTotalItems();

    return { data: productsWithUser, totalItems };
  }
}
