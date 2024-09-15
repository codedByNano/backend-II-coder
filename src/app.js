import express from "express";
import { __dirname } from "./util.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import setupSocketHandlers from "./public/socketHandlers.js";
import { AppInit } from "./init/initialConfig.js";

const app = express();

AppInit(app);
const httpServer = createServer(app);
const io = new Server(httpServer);


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


setupSocketHandlers(io);

app.listen(process.env.PORT, () => {
  console.log("Servidor listo http://localhost:8080");
});

export { io };
