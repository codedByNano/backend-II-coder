import Cart from "../models/cart.model.js";

class CartDAO {
  async getCarts() {
    try {
      return await Cart.find();
    } catch (error) {
      console.error("Error getting carts:", error);
      throw new Error("Error getting carts");
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate("products.product").lean();
      if (!cart) throw new Error(`Carrito con id ${id} no encontrado`);
      return cart;
    } catch (error) {
      console.error(`Error getting cart with id ${id}:`, error);
      throw new Error(`Error getting cart with id ${id}`);
    }
  }

  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      return await newCart.save();
    } catch (error) {
      console.error("Error creating cart:", error);
      throw new Error("Error creating cart");
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const currentCart = await Cart.findById(cartId);
      const productIndex = currentCart.products.findIndex((p) =>
        p.product.equals(productId)
      );

      if (productIndex > -1) {
        currentCart.products[productIndex].quantity += quantity;
      } else {
        currentCart.products.push({ product: productId, quantity });
      }

      return await currentCart.save();
    } catch (error) {
      console.error(`Error adding product to cart with id ${cartId}:`, error);
      throw new Error(`Error adding product to cart with id ${cartId}`);
    }
  }
}

export default CartDAO;
