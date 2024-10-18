import { io } from "../app.js";
import ProductDAO from "../dao/product.dao.js";
import ProductDTO from "../dto/product.dto.js";

class ProductManager {
  constructor() {
    this.productDAO = new ProductDAO();
  }

  async getProducts(options = {}) {
    try {
      const result = await this.productDAO.getProducts(options);
      return {
        status: "success",
        payload: result.docs.map((product) => new ProductDTO(product)),
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevPage
          ? `/api/products?page=${result.prevPage}&limit=${options.limit}`
          : null,
        nextLink: result.nextPage
          ? `/api/products?page=${result.nextPage}&limit=${options.limit}`
          : null,
      };
    } catch (error) {
      console.error("Error getting products:", error);
      throw new Error("Error getting products");
    }
  }

  async getProductById(id) {
    try {
      const product = await this.productDAO.getProductById(id);
      return new ProductDTO(product);
    } catch (error) {
      console.error(`Error getting product with id ${id}`, error);
      throw new Error(`Error getting product with id ${id}`);
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = await this.productDAO.addProduct(productData);
      io.emit("ProductUpdate", await this.getProducts());
      return new ProductDTO(newProduct);
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Error adding product");
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await this.productDAO.updateProduct(id, productData);
      io.emit("ProductUpdate", await this.getProducts());
      return new ProductDTO(updatedProduct);
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw new Error(`Error updating product with id ${id}`);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await this.productDAO.deleteProduct(id);
      io.emit("ProductUpdate", await this.getProducts());
      return new ProductDTO(deletedProduct);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw new Error(`Error deleting product with id ${id}`);
    }
  }
}

export default ProductManager;