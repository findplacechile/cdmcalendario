import express from 'express';
import { createSpecialDate } from '../controllers/specialDatesControllers';

export const specialDateRoute = express.Router();

specialDateRoute.post('/special-date', createSpecialDate);
