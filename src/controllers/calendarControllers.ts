import { Request, Response } from "express";
import { db } from "../models/db";

interface CalendarRq {
  professional_id: number;
  date: Date;
}

export const getCalendar = async (req: Request, res: Response) => {
  // extraer body de la req
  const body: CalendarRq = req.body;
  console.log(body);
  if (!body.date || !body.professional_id) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }
  // extraer de la tabla schedules y rest_days las informaciones para sincronizar el calendario
  const schedules = await db.schedules.findUnique({
    where: {
      professional_id: body.professional_id,
    },
  });

  const restDays = await db.rest_days.findMany({
    where: {
      professional_id: body.professional_id,
    },
    select: {
      id: false,
      professional_id: false,
      day_week: true,
    },
  });

  const currentDate = new Date(body.date);
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const specialDate = await db.special_dates.findMany({
    where: {
      professional_id: body.professional_id,
      AND: {
        date: {
          gte: firstDay,
          lte: lastDay,
        },
      },
    },
  });

  // const availableHours = [];
  // const professionalSession = schedules.duration;
  // const count = schedules.schedule_start;
  // const duration =
  //   Math.round(
  //     Math.abs(
  //       (count.getTime() - schedules.rest_start.getTime()) /
  //         1000 /
  //         professionalSession
  //     )
  //   ) > professionalSession;
  // do {
  //   const currentHour = new Date(count);
  //   currentHour.setMinutes(currentHour.getMinutes() + professionalSession);
  //   currentHour < schedules.rest_start && availableHours.push(new Date(count));
  //   count.setMinutes(count.getMinutes() + professionalSession);
  // } while (count < schedules.rest_start);

  const availableHours = [];
  const professionalSession = schedules.duration;
  for (let index = 0; index < 2; index++) {
    const counter = !index ? schedules.schedule_start : schedules.rest_end;
    const limit = !index ? schedules.rest_start : schedules.schedule_end;
    do {
      console.log(counter);
      const currentHour = new Date(counter);
      currentHour.setMinutes(currentHour.getMinutes() + professionalSession);
      currentHour < limit && availableHours.push(new Date(counter));
      counter.setMinutes(counter.getMinutes() + professionalSession);
    } while (counter < limit);
  }

  return res.status(200).json({
    restDays: restDays.map((item) => item.day_week),
    schedules,
    specialDate: specialDate.map(({ date, id }) => ({ date, id })),
    availableHours,
    busyDates: []
  });
};

//crear update de todos los métodos, specialDate, calendar, etc
//calcular cuantas sesiones tiene disponible el profesional entre horario de trabajo inicial y final
