import CustomRouter from "./customRouter.js";
import CartManager from "../class/cartManager.js";
import CartDTO from "../dto/cart.dto.js";

export default class CartRouter extends CustomRouter {
  constructor() {
    super();
    this.cartManager = new CartManager();
  }

  init() {
    this.post("/", ["PUBLIC"], async (req, res) => {
      const newCart = await this.cartManager.createCart();
      res.success({ cartId: newCart._id });
    });

    this.get("/:cid", ["PUBLIC"], async (req, res) => {
      const { cid } = req.params;
      const cart = await this.cartManager.getCartById(cid);
      res.success(new CartDTO(cart));
    });

    this.post("/:cid/product/:pid", ["USER"], async (req, res) => {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await this.cartManager.addProductToCart(cid, pid, quantity);
      res.success({ message: "Producto añadido al carrito" });
    });

    this.delete("/:cid/products/:pid", ["USER"], async (req, res) => {
      const { cid, pid } = req.params;
      await this.cartManager.deleteProductFromCart(cid, pid);
      res.success({ message: "Producto eliminado del carrito" });
    });

    this.put("/:cid", ["USER"], async (req, res) => {
      const { cid } = req.params;
      const { products } = req.body;
      await this.cartManager.updateCart(cid, products);
      res.success({ message: "Carrito actualizado" });
    });

    this.put("/:cid/products/:pid", ["USER"], async (req, res) => {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await this.cartManager.updateProductQuantityInCart(cid, pid, quantity);
      res.success({ message: "Cantidad de producto actualizada" });
    });

    this.delete("/:cid", ["USER"], async (req, res) => {
      const { cid } = req.params;
      await this.cartManager.clearCart(cid);
      res.success({ message: "Todos los productos eliminados del carrito" });
    });

    this.post("/:cid/purchase", ["USER"], async (req, res) => {
      const { cid } = req.params;
      const cart = await this.cartManager.getCartById(cid);
    
      const productsNotProcessed = [];
      const productsToPurchase = [];
    
      for (const item of cart.products) {
        const product = await this.productManager.getProductById(item.product._id);
        if (product.stock >= item.quantity) {
          productsToPurchase.push({ product, quantity: item.quantity });
        } else {
          productsNotProcessed.push(item.product._id);
        }
      }
    
      if (productsToPurchase.length > 0) {
        const amount = productsToPurchase.reduce((total, item) => total + item.product.price * item.quantity, 0);
        const purchaser = req.user.email;
        const ticket = await this.ticketManager.createTicket({ amount, purchaser });
    
        for (const item of productsToPurchase) {
          await this.productManager.updateProduct(item.product._id, { stock: item.product.stock - item.quantity });
          await this.cartManager.deleteProductFromCart(cid, item.product._id);
        }
    
        res.success({ message: "Compra realizada con éxito", ticket });
      } else {
        res.errorServer({ message: "No hay suficiente stock de los productos seleccionados", productsNotProcessed });
      }
    });
  }
}