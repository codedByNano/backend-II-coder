import CustomRouter from "./customRouter.js";
import ProductManager from "../class/productManager.js";
import ProductDTO from "../dto/product.dto.js";

export default class ProductRouter extends CustomRouter {
  constructor() {
    super();
    this.productManager = new ProductManager();
  }

  init() {
    this.get("/", ["PUBLIC"], async (req, res) => {
      const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
        sort: req.query.sort || "",
        query: req.query.query ? JSON.parse(req.query.query) : {},
      };
      const productList = await this.productManager.getProducts(options);
      res.success(productList);
    });

    this.get("/:pid", ["PUBLIC"], async (req, res) => {
      const { pid } = req.params;
      const product = await this.productManager.getProductById(pid);
      res.success(new ProductDTO(product));
    });

    this.post("/", ["ADMIN"], async (req, res) => {
      const productData = req.body;
      const newProduct = await this.productManager.addProduct(productData);
      res.success(new ProductDTO(newProduct));
    });

    this.put("/:pid", ["ADMIN"], async (req, res) => {
      const { pid } = req.params;
      const productData = req.body;
      const updatedProduct = await this.productManager.updateProduct(pid, productData);
      res.success(new ProductDTO(updatedProduct));
    });

    this.delete("/:pid", ["ADMIN"], async (req, res) => {
      const { pid } = req.params;
      await this.productManager.deleteProduct(pid);
      res.success({ message: "Producto eliminado" });
    });
  }
}