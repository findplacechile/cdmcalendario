import { Request, Response } from 'express';
import { db } from '../models/db';

interface Schedule {
    professional_id: number
    schedule_start: Date
    schedule_end:    Date
    rest_start:      Date
    rest_end: Date
    duration: number
}

export const createSchedule = async (req: Request, res: Response) => {
    try {
        const body : Schedule = req.body;
        const scheduleFields = ['rest_start', 'rest_end', 'schedule_start', 'schedule_end', 'professional_id', 'duration'];
        const filterFields = scheduleFields.filter(item => !body[item]);
        
        if(filterFields.length) {
            res.status(400).json({ message: `This fields are missing: ${filterFields.join(', ')}`})
        }

        const userSchedules = await db.schedules.findFirst(
            {where: {
                professional_id: body.professional_id
            }}
        );

        if(userSchedules) {
            res.status(400).json({ message: 'This user has already a schedule', code: 'use-has-schedule'})
        }

        const scheduleBody = {
                    rest_start: body.rest_start,
                    rest_end: body.rest_end,
                    schedule_end: body.schedule_end,
                    schedule_start: body.schedule_start,
                    professional_id: body.professional_id,
                    duration: body.duration
                }

        const scheduleReq = await db.schedules.create({
            data: scheduleBody
        });
        res.status(201).json({ result: scheduleReq})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'error'})
    }
};
