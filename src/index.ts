// import express from 'express'
// import { db } from './models/db'

// interface Result {
//     professional_id: number
//     schedules_start: Date
//     schedule_end:    Date
//     rest_start:      Date
//     rest_end: Date
// }

// const app = express();
// app.use(express.json())

// app.get('/ping', (_, res) => res.json({message: 'pong 3'}))

// app.post('/squedules', async (req, res) => {
//     const result : Result = req.body

// })

// app.listen(4000)

import express from "express";
import { calendarRoute } from "./routes/calendarRoute";
import { professionalsRoute } from "./routes/professionalsRoute";
import { restDaysRoute } from "./routes/restDaysRoute";
import { schedulesRoute } from "./routes/schedulesRoute";
import { specialDateRoute } from "./routes/specialDateRoute";
import { usuariosRoute } from "./routes/usuariosRoute";
import cors, { CorsOptions } from "cors";

const app = express();

const dominiosPermitidos: string[] = [process.env.FRONTEND_URL as string];

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (origin && dominiosPermitidos.indexOf(origin) !== -1) {
      // origen del request está permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", usuariosRoute);
app.use("/api", professionalsRoute);
app.use("/api", schedulesRoute);
app.use("/api", restDaysRoute);
app.use("/api", schedulesRoute);
app.use("/api", specialDateRoute);
app.use("/api", calendarRoute);

app.get("/ping", (_, res) => res.json({ message: "pong 3" }));

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
