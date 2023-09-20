import I18n from "../../../i18n";
import { Products } from "../../../models/products";
import { error, success } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";

export interface UpdateProductsParams {
  id: string;
  description?: string;
  quantity?: number;
  price?: string;
  image?: string;
  category?: string;
  supplier?: string;
  userWhoRegistered?: string;
}

export interface IUpdateProductsRepository {
  updateProducts(id: string, params: UpdateProductsParams): Promise<Products>;
}

export class UpdateProductsController implements IController {
  constructor(
    private readonly updateProductsRepository: IUpdateProductsRepository
  ) {}
  async handle(
    httpRequest: HttpRequest<UpdateProductsParams>
  ): Promise<HttpResponse<Products | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return error(I18n.__("body.is.required"));
      }

      if (!id) {
        return error(I18n.__("missing.id", { field: "Products" }));
      }
      const allowedFieldsTtoUpdate: (keyof UpdateProductsParams)[] = [
        "category",
        "category",
        "description",
        "image",
        "price",
        "quantity",
        "supplier",
        "userWhoRegistered",
      ];

      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) =>
          !allowedFieldsTtoUpdate.includes(key as keyof UpdateProductsParams)
      );

      if (someFieldIsNotAllowedToUpdate) {
        return error(I18n.__("some.field.is.not.allowed.to.update"));
      }
      const Products = await this.updateProductsRepository.updateProducts(
        id,
        body
      );
      return success(Products);
    } catch (err) {
      return error(I18n.__("something.went.wrong"), 500);
    }
  }
}
