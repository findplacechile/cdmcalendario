import { Request, Response } from "express";
import { db } from "../models/db";

interface SpecialDate {
  professional_id: number;
  date: Date;
  schedule_start: Date;
  schedule_end: Date;
  rest_start: Date;
  rest_end: Date;
  //agregar duaration
}

export const createSpecialDate = async (req: Request, res: Response) => {
  try {
    const body: SpecialDate = req.body;
    console.log(body);

    const specialDate = {
      professional_id: body.professional_id,
      date: body.date,
    };
    const specialSquedule = {
      schedule_start: body.schedule_start,
      schedule_end: body.schedule_end,
      rest_start: body.rest_start,
      rest_end: body.rest_end,
    };

    //todos los campos son obligatorios
    if (
      !body.professional_id ||
      !body.date ||
      !body.schedule_start ||
      !body.schedule_end ||
      !body.rest_start ||
      !body.rest_end
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    //schedule end no puede ser menor a start
    const scheduleStart = new Date(body.schedule_start);
    const scheduleEnd = new Date(body.schedule_end);

    if (scheduleEnd < scheduleStart) {
      return res.status(400).json({
        error: "La hora de finalización debe ser posterior a la hora de inicio",
      });
    }

    //rest end no puede ser menor a start
    const restStart = new Date(body.rest_start);
    const restEnd = new Date(body.rest_end);

    if (restEnd < restStart) {
      return res.status(400).json({
        error: "La hora de finalización debe ser posterior a la hora de inicio",
      });
    }
    //comprobar que el professionalId existe (este fue con chatgpt)
    const professionalId = body.professional_id;

    // Buscar el professionalId en la base de datos
    const professional = await db.profesionales.findUnique({
      where: { id: professionalId },
    });

    // Si el professionalId no existe, enviar una respuesta de error
    if (!professional) {
      return res.status(400).json({ error: "El professionalId no existe" });
    }

    //crear validaciones para que las fechas especiales sean dentro del horario de trabajo
    //hacer consulta pra traer las fechas que el profesional está libre

    // opcion 1
    //consultar dias especiales
    //consultar dias de descanso
    // if registrar dia especial en fechas diferentes a estas consultas

    //opcion 2
    //consultar dias de trabajo libre
    // if registrar fevhas dentro de ese horario

    const dbReq = await db.special_dates.create({
      data: { ...specialDate, special_schedule: { create: specialSquedule } },
    });
    res.status(201).json({ dbReq });
  } catch (error) {
    console.log(error);
  }
};
