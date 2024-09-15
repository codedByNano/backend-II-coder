import ProductManager from "../class/productManager.js";

const productManager = new ProductManager();

export default function setupSocketHandlers(io) {
  io.on("connection", async (socket) => {
    console.log(`Cliente conectado, ID: ${socket.id}`);

    socket.on("addProduct", async (product, callback) => {
      try {
        const newProduct = await productManager.addProduct(product);
        io.emit("ProductUpdate", await productManager.getProducts());
        callback({ error: null, product: newProduct });
      } catch (error) {
        console.error("Error adding product:", error);
        callback({ error: "Error adding product" });
      }
    });

    socket.on("editProduct", async (product, callback) => {
      try {
        const updatedProduct = await productManager.updateProduct(
          product.id,
          product
        );
        io.emit("ProductUpdate", await productManager.getProducts());
        callback({ error: null, product: updatedProduct });
      } catch (error) {
        console.error("Error editing product:", error);
        callback({ error: "Error editing product" });
      }
    });

    socket.on("deleteProduct", async (id, callback) => {
      try {
        await productManager.deleteProduct(id);
        io.emit("ProductUpdate", await productManager.getProducts());
        callback({ error: null });
      } catch (error) {
        console.error("Error deleting product:", error);
        callback({ error: "Error deleting product" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
}
