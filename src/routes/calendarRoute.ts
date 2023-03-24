import express from "express";
import { getCalendar } from "../controllers/calendarControllers";

export const calendarRoute = express.Router();

calendarRoute.post("/calendar", getCalendar);
