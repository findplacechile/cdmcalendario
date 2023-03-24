import express from "express";
import { createSchedule } from "../controllers/scheduleControllers";

export const schedulesRoute = express.Router();

schedulesRoute.post("/schedule", createSchedule);
