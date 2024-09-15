import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, required: true },
    },
  ],
});

cartSchema.plugin(mongoosePaginate);

const cart = mongoose.model("carts", cartSchema);

export default cart;
