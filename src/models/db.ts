// import { PrismaClient } from "@prisma/client";

// export const db: PrismaClient = new PrismaClient();

import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

db.$on("query", (e) => {
  console.log(e);
});
db.$on("info", (e) => {
  console.log(e);
});
db.$on("warn", (e) => {
  console.log(e);
});
db.$on("error", (e) => {
  console.log(e);
});
