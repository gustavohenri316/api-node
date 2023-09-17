import { Router } from "express";
import { CreateProductsController } from "../../controllers/products/create-products";
import { DeleteProductsController } from "../../controllers/products/delete-products";
import { GetProductsController } from "../../controllers/products/get-products";
import { UpdateProductsController } from "../../controllers/products/update-products";
import { MongoCreateProductsRepository } from "../../repositories/products/create-products";
import { MongoDeleteProductsRepository } from "../../repositories/products/delete-products";
import { MongoGetProductRepository } from "../../repositories/products/get-products";
import { MongoUpdateProductsRepository } from "../../repositories/products/update-products";

const ProductRouter = Router();

ProductRouter.post("/products", async (req, res) => {
  const mongoCreateProductsRepository = new MongoCreateProductsRepository();
  const createProductsController = new CreateProductsController(
    mongoCreateProductsRepository
  );
  const { body, statusCode } = await createProductsController.handle({
    body: req.body,
  });
  res.status(statusCode).send(body);
});
ProductRouter.get("/products", async (req, res) => {
  const mongoGetProductsRepository = new MongoGetProductRepository();
  const getProductsController = new GetProductsController(
    mongoGetProductsRepository
  );

  const page = parseInt(req.query.page as string, 10) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;

  const filters = {
    id: req.query.id as string,
    description: req.query.description as string,
    category: req.query.category as string,
    supplier: req.query.supplier as string,
    userWhoRegistered: req.query.userWhoRegistered as string,
  };

  const { body, statusCode } = await getProductsController.handle({
    params: {
      page: page,
      itemsPerPage: itemsPerPage,
      query: filters,
    },
  });

  res.status(statusCode).send(body);
});

ProductRouter.patch("/products/:id", async (req, res) => {
  const mongoUpdateProductsRepository = new MongoUpdateProductsRepository();
  const updateProductsController = new UpdateProductsController(
    mongoUpdateProductsRepository
  );
  const { body, statusCode } = await updateProductsController.handle({
    body: req.body,
    params: req.params,
  });
  res.status(statusCode).send(body);
});

ProductRouter.delete("/products/:id", async (req, res) => {
  const mongoDeleteProductsRepository = new MongoDeleteProductsRepository();
  const deleteProductsController = new DeleteProductsController(
    mongoDeleteProductsRepository
  );
  const { body, statusCode } = await deleteProductsController.handle({
    params: req.params,
  });
  res.status(statusCode).send(body);
});

export default ProductRouter;
