import { Request, Response } from "express";
import { db } from "../models/db";

interface RestDays {
  professional_id: number;
  day_week: number;
  id: number;
}

export const createrestDays = async (req: Request, res: Response) => {
  try {
    const body: RestDays = req.body;

    if (body.day_week === null || !body.professional_id) {
      return res
        .status(400)
        .json({ message: "All fields are obligatory", code: "" });
    }

    const registeredDays = await db.rest_days.findMany({
      where: {
        professional_id: body.professional_id,
      },
    });

    //evaluar si el profesional existe
    const professionalId = body.professional_id;

    // Buscar el professionalId en la base de datos
    const professional = await db.profesionales.findUnique({
      where: { id: professionalId },
    });

    // Si el professionalId no existe, enviar una respuesta de error
    if (!professional) {
      return res.status(400).json({ error: "El professionalId no existe" });
    }

    // hacer validacion donde el usuario no pueda registrar dias de descanso inexistente 0 a 6 dias de la semana
    if (body.day_week < 0 || body.day_week > 6) {
      return res
        .status(400)
        .json({ message: "Invalid day of the week", code: "" });
    }

    // hacer validacion donde el usuario no pueda registrar dias que ya estan en la DB
    if (registeredDays.some((item) => item.day_week === body.day_week)) {
      return res
        .status(400)
        .json({ message: "This day was alredy registered", code: "" });
    }

    // if(registeredDays.length >= 7) {
    //     return res.status(400).json({message: 'You can\'t register more than 1 day', code: ''})
    // }

    const restDayBody = {
      professional_id: body.professional_id,
      day_week: body.day_week,
    };

    const scheduleReq = await db.rest_days.create({
      data: restDayBody,
    });

    res.status(201).json({
      body: scheduleReq,
      status: "day-week",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateRestDays = async (req: Request, res: Response) => {
  try {
    const body: RestDays = req.body;

    if (body.day_week === null || !body.professional_id || !body.id) {
      return res
        .status(400)
        .json({ message: "All fields are obligatory", code: "" });
    }

    // hacer validacion donde el usuario no pueda registrar dias de descanso inexistente 0 a 6 dias de la semana
    if (body.day_week < 0 || body.day_week > 6) {
      return res
        .status(400)
        .json({ message: "Invalid day of the week", code: "" });
    }

    // hacer validacion donde el usuario no pueda registrar dias que ya estan en la DB

    const registeredDays = await db.rest_days.findMany({
      where: {
        professional_id: body.professional_id,
      },
    });

    if (registeredDays.some((item) => item.day_week === body.day_week)) {
      return res
        .status(400)
        .json({ message: "This day was alredy registered", code: "" });
    }

    const restDayBody = {
      day_week: body.day_week,
    };

    const scheduleReq = await db.rest_days.update({
      where: {
        id: body.id,
      },
      data: restDayBody,
    });

    res.status(200).json({
      body: scheduleReq,
      status: "day-week updated",
    });
  } catch (error) {
    console.log(error);
  }
};
