import Product from "../models/product.model.js";

class ProductDAO {
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

      return result;
    } catch (error) {
      console.error("Error getting products:", error);
      throw new Error("Error getting products");
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
      return await product.save();
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Error adding product");
    }
  }

  async updateProduct(id, productData) {
    try {
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw new Error(`Error updating product with id ${id}`);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw new Error(`Error deleting product with id ${id}`);
    }
  }
}

export default ProductDAO;