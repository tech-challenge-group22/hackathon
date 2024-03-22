import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import * as dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY_JWT_TOKEN;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, `${secretKey}`, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: 'Token inválido' });
    } else {
      console.log('decoded',decoded);
      req.body.payloadJwt = decoded;
      next();
    }
  });
}

export function validatePermission(req: Request, res: Response, registryRequest:number){
  let token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });
  jwt.verify(token, `${secretKey}`, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: 'Token inválido' });
    } else {
      let value: any = decoded;
      if(value.employee_registry != registryRequest){
        res.status(403).json({ message: 'Você não tem permissão para utilizar uma registro diferente do seu' });
      }
    }
  });
}
