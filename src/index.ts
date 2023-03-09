import express from 'express'
import { db } from './models/db'

interface Result {
    professional_id: number
    schedules_start: Date
    schedule_end:    Date
    rest_start:      Date
    rest_end: Date 
}

const app = express();
app.use(express.json())

app.get('/ping', (_, res) => res.json({message: 'pong 3'}))

app.post('/squedules', async (req, res) => {
    const result : Result = req.body 
    
})


app.listen(4000)