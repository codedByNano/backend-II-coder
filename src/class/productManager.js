import { io } from "../app.js";
import Product from "../models/product.model.js";

class ProductManager {
  async getProducts(options = {}) {
    try {
      const { limit = 10, page = 1, sort, query } = options;
      const filter = {};
      if (query) {
        if (query.category) filter.category = query.category;
        if (query.status) filter.status = query.status = true;
      }

      const sortOption = {};
      if (sort) {
        sortOption.price = sort === "asc" ? 1 : -1;
      }

      const result = await Product.paginate(filter, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOption,
        lean: true,
      });

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevPage
          ? `/api/products?page=${result.prevPage}&limit=${limit}`
          : null,
        nextLink: result.nextPage
          ? `/api/products?page=${result.nextPage}&limit=${limit}`
          : null,
      };
    } catch (error) {
      console.error("Error geting products:", error);
      throw new Error("Error geting products");
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error(`Error getting product with id ${id}`, error);
      throw new Error(`Error getting product with id ${id}`);
    }
  }

  async addProduct(productData) {
    try {
      const isExists = await Product.findOne({ code: productData.code });
      if (isExists) {
        throw new Error("¡El código de producto ya existe!");
      }

      const product = new Product(productData);
      const prodAdded = await product.save();
      io.emit("ProductUpdate", await this.getProducts());
      return prodAdded;
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Error adding product");
    }
  }

  async updateProduct(id, productData) {
    try {
      const prodUpdated = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
      io.emit("ProductUpdate", await this.getProducts());
      return prodUpdated;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw new Error(`Error updating product with id ${id}`);
    }
  }

  async deleteProduct(id) {
    try {
      const prodDeleted = await Product.findByIdAndDelete(id);
      io.emit("ProductUpdate", await this.getProducts());
      return prodDeleted;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw new Error(`Error deleting product with id ${id}`);
    }
  }
}

export default ProductManager;
