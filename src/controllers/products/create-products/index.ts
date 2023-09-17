import { Products } from "../../../models/products";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import validator from "validator";

export interface CreateProductsParams {
  id: string;
  description: string;
  quantity: number;
  price: string;
  image: string;
  category: string;
  supplier: string;
  userWhoRegistered: string;
}

export interface ICreateProductsRepository {
  createProducts(params: CreateProductsParams): Promise<Products>;
}
export class CreateProductsController implements IController {
  constructor(
    private readonly createProductsRepository: ICreateProductsRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<CreateProductsParams>
  ): Promise<HttpResponse<Products>> {
    try {
      if (!httpRequest?.body) {
        return {
          statusCode: 400,
          body: {
            message: "Body is required",
          },
        };
      }
      const {
        id,
        description,
        quantity,
        price,
        image,
        category,
        supplier,
        userWhoRegistered,
      } = httpRequest.body;

      if (
        !id ||
        !description ||
        !quantity ||
        !price ||
        !category ||
        !supplier
      ) {
        return {
          statusCode: 400,
          body: "Missing required fields for product creation.",
        };
      }

      if (!validator.isNumeric(quantity.toString())) {
        return {
          statusCode: 400,
          body: "Quantity must be a numeric value.",
        };
      }

      if (!validator.isNumeric(price.toString())) {
        return {
          statusCode: 400,
          body: "Price must be a numeric value.",
        };
      }

      const product: CreateProductsParams = {
        id,
        description,
        quantity,
        price: price.toString(),
        image,
        category,
        supplier,
        userWhoRegistered,
      };

      const createdProduct =
        await this.createProductsRepository.createProducts(product);

      return {
        statusCode: 201,
        body: createdProduct,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: "Something went wrong.",
      };
    }
  }
}
