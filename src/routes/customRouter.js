import { Router } from "express";
import jwt from "jsonwebtoken";

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
    res.errorServer = (error) => res.status(500).json({ status: "Error del servidor", error });
    res.notFound = () => res.status(404).json({ status: "not found", error: "Recurso no encontrado" });
    next();
  }

  handlePolicies(policies) {
    return (req, res, next) => {
      if (policies.includes("PUBLIC")) return next();
      const reqJWT = req.headers.authorization;
      if (!reqJWT) return res.status(400).send({ status: "error", message: "No logueado" });
      let userPayload = null;
      try {
        userPayload = jwt.verify(reqJWT, process.env.SECRET);
      } catch (e) {
        return res.status(400).send({ status: "error", message: e });
      }
      if (!userPayload) return res.status(400).send({ status: "error", message: "Error en el token" });
      if (!policies.includes(userPayload.rol.toUpperCase()))
        return res.status(403).send({ status: "error", message: "No estas autorizado" });
      req.user = userPayload;
      next();
    };
  }

  get(path, policies, ...cb) {
    this.router.get(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
  }

  post(path, policies, ...cb) {
    this.router.post(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
  }

  put(path, policies, ...cb) {
    this.router.put(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
  }

  delete(path, policies, ...cb) {
    this.router.delete(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
  }
}