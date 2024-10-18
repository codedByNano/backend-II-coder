import CartRepository from "../repositories/cart.repository.js";
import CartDTO from "../dto/cart.dto.js";

class CartManager {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getCarts() {
    try {
      const carts = await this.cartRepository.getCarts();
      return carts.map((cart) => new CartDTO(cart));
    } catch (error) {
      console.error("Error getting carts:", error);
      throw new Error("Error getting carts");
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.cartRepository.getCartById(id);
      return new CartDTO(cart);
    } catch (error) {
      console.error(`Error getting cart with id ${id}:`, error);
      throw new Error(`Error getting cart with id ${id}`);
    }
  }

  async createCart() {
    try {
      const newCart = await this.cartRepository.createCart();
      return new CartDTO(newCart);
    } catch (error) {
      console.error("Error creating cart:", error);
      throw new Error("Error creating cart");
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const updatedCart = await this.cartRepository.addProductToCart(cartId, productId, quantity);
      return new CartDTO(updatedCart);
    } catch (error) {
      console.error(`Error adding product to cart with id ${cartId}:`, error);
      throw new Error(`Error adding product to cart with id ${cartId}`);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const updatedCart = await this.cartRepository.deleteProductFromCart(cartId, productId);
      return new CartDTO(updatedCart);
    } catch (error) {
      console.error(`Error deleting product from cart with id ${cartId}:`, error);
      throw new Error(`Error deleting product from cart with id ${cartId}`);
    }
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const updatedCart = await this.cartRepository.updateProductQuantityInCart(cartId, productId, quantity);
      return new CartDTO(updatedCart);
    } catch (error) {
      console.error(`Error updating product quantity in cart with id ${cartId}:`, error);
      throw new Error(`Error updating product quantity in cart with id ${cartId}`);
    }
  }

  async clearCart(cartId) {
    try {
      const updatedCart = await this.cartRepository.clearCart(cartId);
      return new CartDTO(updatedCart);
    } catch (error) {
      console.error(`Error clearing cart with id ${cartId}:`, error);
      throw new Error(`Error clearing cart with id ${cartId}`);
    }
  }
}

export default CartManager;