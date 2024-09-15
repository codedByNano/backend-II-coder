document.addEventListener("DOMContentLoaded", async () => {
  function getCartId() {
    return localStorage.getItem("cartId");
  }

  function setCartId(cartId) {
    localStorage.setItem("cartId", cartId);
  }

  async function createCart() {
    try {
      const response = await fetch("/api/carts", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setCartId(data.cartId);
      } else {
        console.error("Error al crear el carrito");
      }
    } catch (error) {
      console.error("Error al crear carrito:", error);
    }
  }

  async function addProductToCart(productId) {
    try {
      const cartId = getCartId();
      const response = await fetch(
        `/api/carts/${cartId}/product/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
        }
      );

      if (response.ok) {
        alert("Producto añadido al carrito");
      } else {
        console.error("Error al agregar producto al carrito");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }

  document.querySelectorAll("#addToCartBtn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("dataProductId");
      addProductToCart(productId);
    });
  });

  const singleAddToCartBtn = document.getElementById("singleAddToCartBtn");
  if (singleAddToCartBtn) {
    singleAddToCartBtn.addEventListener("click", () => {
      const productId = singleAddToCartBtn.getAttribute("dataProductId");
      addProductToCart(productId);
    });
  }

  const cartId = getCartId();
  console.log(cartId);

  if (!cartId) {
    await createCart();
  }
});
