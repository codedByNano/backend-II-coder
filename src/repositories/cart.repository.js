import CartDAO from "../dao/cart.dao.js";

class CartRepository {
  constructor() {
    this.cartDAO = new CartDAO();
  }

  async getCarts() {
    return await this.cartDAO.getCarts();
  }

  async getCartById(id) {
    return await this.cartDAO.getCartById(id);
  }

  async createCart() {
    return await this.cartDAO.createCart();
  }

  async addProductToCart(cartId, productId, quantity) {
    return await this.cartDAO.addProductToCart(cartId, productId, quantity);
  }

  async deleteProductFromCart(cartId, productId) {
    return await this.cartDAO.deleteProductFromCart(cartId, productId);
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    return await this.cartDAO.updateProductQuantityInCart(cartId, productId, quantity);
  }

  async clearCart(cartId) {
    return await this.cartDAO.clearCart(cartId);
  }
}

export default CartRepository;
