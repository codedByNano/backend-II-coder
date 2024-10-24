import { Router } from "express";
import { invokePassport } from "../middlewares/handlerError.js";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  applyCallbacks(cb) {
    return cb.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (e) {
        return params[1].status(500).send(e);
      }
    });
  }

  customResponses(req, res, next) {
    res.success = (payload) => res.json({ status: "success", payload });
    res.errorServer = (error) =>
      res.status(500).json({ status: "Error del servidor", error });
    res.notFound = () =>
      res
        .status(404)
        .json({ status: "not found", error: "Recurso no encontrado" });
    next();
  }

  handlePolicies(policies) {
    return [
      invokePassport("jwt"),
      (req, res, next) => {
        if (policies.includes("PUBLIC")) return next();
        if (!req.user)
          return res
            .status(400)
            .send({ status: "error", message: "No logueado" });
        if (!policies.includes(req.user.role.toUpperCase()))
          return res
            .status(403)
            .send({ status: "error", message: "No estas autorizado" });
        next();
      },
    ];
  }

  get(path, policies, ...cb) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.customResponses,
      this.applyCallbacks(cb)
    );
  }

  post(path, policies, ...cb) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.customResponses,
      this.applyCallbacks(cb)
    );
  }

  put(path, policies, ...cb) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.customResponses,
      this.applyCallbacks(cb)
    );
  }

  delete(path, policies, ...cb) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.customResponses,
      this.applyCallbacks(cb)
    );
  }
}
