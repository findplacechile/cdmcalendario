import express from "express";
import {
  getUsuario,
  getUsuarios,
  login,
  updateUser,
} from "../controllers/usuariosControllers";

export const usuariosRoute = express.Router();

usuariosRoute.get("/usuarios", getUsuarios);
usuariosRoute.get("/usuario/:id", getUsuario);
usuariosRoute.post("/login", login);
usuariosRoute.put("/update-user/:id", updateUser);
