import ProductDAO from "../dao/product.dao.js";

class ProductRepository {
  constructor() {
    this.productDAO = new ProductDAO();
  }

  async getProducts(options = {}) {
    return await this.productDAO.getProducts(options);
  }

  async getProductById(id) {
    return await this.productDAO.getProductById(id);
  }

  async addProduct(productData) {
    return await this.productDAO.addProduct(productData);
  }

  async updateProduct(id, productData) {
    return await this.productDAO.updateProduct(id, productData);
  }

  async deleteProduct(id) {
    return await this.productDAO.deleteProduct(id);
  }
}

export default ProductRepository;