import express from "express";
import {
  createrestDays,
  updateRestDays,
} from "../controllers/restDaysControllers";

export const restDaysRoute = express.Router();

restDaysRoute.post("/rest-day", createrestDays);
restDaysRoute.put("/update-rest-day", updateRestDays);
