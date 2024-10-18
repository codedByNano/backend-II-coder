class CartDTO {
    constructor(cart) {
      this.id = cart._id;
      this.products = cart.products.map((product) => ({
        id: product.product._id,
        title: product.product.title,
        price: product.product.price,
        quantity: product.quantity,
      }));
    }
  }
  
  export default CartDTO;