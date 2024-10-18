import express from "express";
import dotenv from "dotenv";
import router from "../routes/index.js";
import { connectionDB } from "../mongo/connection.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "../passport/jwt.passport.js";
import ProductRouter from "../routes/products.routes.js";
import CartRouter from "../routes/cart.routes.js";
import viewsRouter from "../routes/views.routes.js";
import { __dirname } from "../util.js";

export const AppInit = (app) => {
  dotenv.config();
  connectionDB();
  initializePassport();
  passport.initialize();
  app.use(cookieParser(process.env.SECRET));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + "/public"));

  app.use("/", router);

  const productRouter = new ProductRouter();
  app.use("/api/products", productRouter.getRouter());

  const cartRouter = new CartRouter();
  app.use("/api/carts", cartRouter.getRouter());

  app.use("/", viewsRouter);
};
