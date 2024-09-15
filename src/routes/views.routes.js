import express from "express";
import ProductManager from "../class/productManager.js";
import { __dirname, cleanProductData } from "../util.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const result = await productManager.getProducts();
  const products = result.payload;
  const cleanedProducts = cleanProductData(products);
  res.render("home", { title: "Home", cleanedProducts });
});

router.get("/realtimeproducts", async (req, res) => {
  const result = await productManager.getProducts();
  const products = result.payload;
  const cleanedProducts = cleanProductData(products);
  res.render("realtimeproducts", {
    title: "Productos en tiempo real",
    cleanedProducts,
  });
});

export default router;
