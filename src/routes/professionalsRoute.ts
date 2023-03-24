import express from "express";
import {
  getProfessional,
  getProfessionals,
  registerProfessional,
  updateProfessional,
} from "../controllers/professionalsController";

export const professionalsRoute = express.Router();

professionalsRoute.get("/professionals", getProfessionals);
professionalsRoute.get("/professional/:id", getProfessional);
professionalsRoute.post("/register-professional", registerProfessional);
professionalsRoute.put("/update-professional/:id", updateProfessional);
