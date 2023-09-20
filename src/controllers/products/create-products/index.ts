import I18n from "../../../i18n";
import { Products } from "../../../models/products";
import { created, error } from "../../helpers";
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
  [key: string]: unknown;
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
      const body = httpRequest?.body;

      if (!body) {
        return error(I18n.__("body.is.required"));
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
      } = body;

      const requiredFields = [
        "id",
        "description",
        "quantity",
        "price",
        "category",
        "supplier",
      ];

      for (const field of requiredFields) {
        if (!body[field]) {
          return error(I18n.__("field.is.required", { field: field }));
        }
      }

      if (!validator.isNumeric(quantity.toString())) {
        return error(I18n.__("quantity.must.be.a.numeric.value"));
      }

      if (!validator.isNumeric(price.toString())) {
        return error(I18n.__("price.must.be.a.numeric.value"));
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
      return created(createdProduct);
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
