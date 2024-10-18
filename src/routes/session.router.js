import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
import { invokePassport } from "../middlewares/handlerError.js";
import UserDTO from "../dto/user.dto.js";
import { UserModel } from "../models/user.model.js";

const route = Router();

route.post("/login", login);
route.post("/register", register);

route.get("/current", invokePassport("jwt"), async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate("cart").lean();
    const userDTO = new UserDTO(user);
    console.log(user);
    res.send(userDTO);
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ error: "Error getting current user" });
  }
});

export default route;
