import express from "express";
import ProductManager from "../class/productManager.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: sort || "",
      query: query ? JSON.parse(query) : {},
    };
    const productList = await productManager.getProducts(options);
    res.render("index", { title: "Lista de productos", productList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    const productPlain = product.toObject ? product.toObject() : product;
    res.render("product", { title: "Detalles del producto", productPlain });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const productData = req.body;
  try {
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: Error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const productData = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(pid, productData);
    res.status(200).json(updatedProduct);
  } catch {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: error.message });
  }
});

export default router;
