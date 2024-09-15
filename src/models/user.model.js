import mongoose, { model, Schema } from "mongoose";

const userCollection = "user";

const userSchema = new Schema({
  nombre: String,
  apelido: String,
  email: {
    type: String,
    unique: true,
  },
  edad: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    default: "user",
  },
});

export const UserModel = model(userCollection, userSchema);
