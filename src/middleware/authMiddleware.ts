import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../models/db';

interface RequestWithUser extends Request {
    usuario?: {
      nombre: string;
      apellidos: string;
    }
  }

  export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: string;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
        const usuario = await db.usuarios.findUnique({
          where: { id: decoded.id },
          select: { nombre: true, apellidos: true },
        });
        req.usuario = usuario;
  
        return next();
      } catch (error) {
        const e = new Error('Token no válido');
        return res.status(403).json({ msg: e.message });
      }
    }
  
    if (!token) {
      const error = new Error('Token no válido o inexistente');
      return res.status(403).json({ msg: error.message });
    }
  
    next();
  };
