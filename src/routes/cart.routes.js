import express from "express";
import CartManager from "../class/cartManager.js";

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ cartId: newCart._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    res.render("cart", { title: "Carrito de compra", cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    await cartManager.addProductToCart(cid, pid, quantity);
    res.status(201).json({ message: "Producto añadido al carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    cart.products = cart.products.filter(
      (product) => !product.product.equals(pid)
    );
    await cart.save();
    res.status(200).json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un array de productos.",
    });
  }

  try {
    const cart = await cartManager.getCartById(cid);
    products.forEach((newProduct) => {
      const isExists = cart.products.findIndex((product) =>
        product.product.equals(newProduct.product)
      );
      if (isExists > -1) {
        cart.products[isExists].quantity += newProduct.quantity;
      } else {
        cart.products.push(newProduct);
      }
    });
    await cart.save();
    res.status(200).json({ message: "Carrito actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartManager.getCartById(cid);
    const productIndex = cart.products.findIndex((p) => p.product.equals(pid));
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Cantidad de producto actualizada" });
    } else {
      res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    cart.products = [];
    await cart.save();
    res
      .status(200)
      .json({ message: "Todos los productos eliminados del carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
