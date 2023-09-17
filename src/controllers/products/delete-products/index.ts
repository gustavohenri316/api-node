import { Products } from "../../../models/products";
import { error, success } from "../../helpers";
import { IController, HttpRequest, HttpResponse } from "../../protocols";

export interface IDeleteProductsRepository {
  deleteProducts(id: string): Promise<Products>;
}
export interface IDeleteProductsParams {
  id: string;
}

export class DeleteProductsController implements IController {
  constructor(
    private readonly deleteProductsRepository: IDeleteProductsRepository
  ) {}
  async handle(
    httpRequest: HttpRequest<IDeleteProductsParams>
  ): Promise<HttpResponse<Products>> {
    try {
      const id = httpRequest?.params?.id;
      if (!id) {
        return error("Id is required");
      }
      const Products = await this.deleteProductsRepository.deleteProducts(id);
      return success(Products);
    } catch (err) {
      return error("Something went wrong.", 500);
    }
  }
}
