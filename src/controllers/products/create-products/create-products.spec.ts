import { Products } from "../../../models/products";
import {
  CreateProductsController,
  CreateProductsParams,
  ICreateProductsRepository,
} from ".";

class CreateProductsRepositoryMock implements ICreateProductsRepository {
  async createProducts(params: CreateProductsParams): Promise<Products> {
    return {
      id: params.id,
      title: "Produto de Teste",
      description: params.description,
      quantity: params.quantity,
      price: parseFloat(params.price),
      image: params.image,
      category: params.category,
      supplier: params.supplier,
      userWhoRegistered: params.userWhoRegistered,
    };
  }
}

describe("CreateProductsController", () => {
  it("deve criar um novo produto", async () => {
    const params: CreateProductsParams = {
      id: "product123",
      description: "Produto de teste",
      quantity: 10,
      price: "19.99",
      image: "imagem.jpg",
      category: "Eletrônicos",
      supplier: "Fornecedor A",
      userWhoRegistered: "user123",
    };

    const repository = new CreateProductsRepositoryMock();
    const controller = new CreateProductsController(repository);
    const result = await controller.handle({
      body: params,
    });
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual({
      id: params.id,
      title: "Produto de Teste",
      description: params.description,
      quantity: params.quantity,
      price: parseFloat(params.price),
      image: params.image,
      category: params.category,
      supplier: params.supplier,
      userWhoRegistered: params.userWhoRegistered,
    });
  });
});
