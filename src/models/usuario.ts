import { db } from "./db";
import bcrypt from "bcrypt";

const findUserByRut = async (rut: string) => {
  return await db.usuarios.findFirst({
    where: {
      rut, // Utiliza la variable 'rut' en lugar del número 172345549
    },
    include: {
      profesionales: {
        select: {
          id: true,
        },
      },
    },
  });
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { findUserByRut, comparePassword };
