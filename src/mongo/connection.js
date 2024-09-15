import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING, {
      dbName: process.env.USE_DB,
    });
    console.log("Base de datos conectada");
  } catch (e) {
    console.log("Error al conectarse a la base de datos");
  }
};
