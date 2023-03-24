import { Request, Response } from "express";
import { db } from "../models/db";

import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import generarJWT from "../helpers/generarJWT";
import { comparePassword, findUserByRut } from "../models/usuario";

interface IUser {
  id: number;
  rut: string;
  password: string;
  nombre: string;
  apellidos: string;
}

interface IUpdateUsuario {
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  whatsapp?: string; // O cambia el tipo a 'boolean' si es un booleano en tu esquema de base de datos
}

export const login = async (req: Request, res: Response) => {
  try {
    const { rut, password } = req.body;
    console.log(`RUT: ${rut}`);

    // Comprobar si el usuario existe
    const usuario: IUser | null = await findUserByRut(rut);
    if (!usuario) {
      const error = new Error("El Usuario no Existe");
      return res.status(404).json({ msg: error.message });
    }
    if (!password || !usuario.password)
      throw new Error("password and hash are required");

    if (comparePassword(password, usuario.password)) {
      // Autenticar
      const token = generarJWT(usuario.id);
      res.json({
        token, // Aquí se usa la variable 'token' correctamente.
        user: {
          id: usuario.id,
          rut: usuario.rut,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
        },
      });
    } else {
      const error = new Error("Password incorrecto");
      return res.status(403).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await db.usuarios.findMany();
    res.send(usuarios);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getUsuario = async (req: Request, res: Response) => {
  try {
    // Realiza la consulta a la base de datos utilizando Prisma
    const usuario = await db.usuarios.findUnique({
      where: { id: Number(req.params.id) },
    });

    // Devuelve los resultados como respuesta
    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    const usuarioActual = await db.usuarios.findUnique({ where: { id } });

    if (!usuarioActual) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const updateData: any = {}; // Cambia el tipo a 'any' para evitar problemas de tipo

    if (req.body.nombre) {
      updateData.nombre = req.body.nombre;
    }
    if (req.body.apellidos) {
      updateData.apellidos = req.body.apellidos;
    }
    if (req.body.email) {
      updateData.email = req.body.email;
    }
    if (req.body.telefono) {
      updateData.telefono = req.body.telefono;
    }
    if (typeof req.body.whatsapp !== "undefined") {
      // Revisa si el valor de 'whatsapp' está presente en req.body
      updateData.whatsapp = req.body.whatsapp;
    }

    const result = await db.usuarios.update({
      where: { id },
      data: updateData,
    });

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno" });
  }
};
