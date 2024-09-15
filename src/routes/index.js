import { Router } from "express";
import { ROUTE_PATH } from "../constants/routesPath.js";
import SessionRouter from "./session.router.js";

const app = Router();

app.use(ROUTE_PATH.api_session, SessionRouter);

export default app;
