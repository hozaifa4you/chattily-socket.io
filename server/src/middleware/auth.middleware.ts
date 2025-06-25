import { jwt_secret } from '@/config/env';
import { prisma } from '@/lib/prisma';
import { JWTPayload } from '@/types/jwt-payload';
import { log } from 'console';
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
   const token = req.headers.token;
   if (!token) {
      return res.status(401).json({
         success: false,
         message: 'Unauthorized',
         error: 'Token not provided',
      });
   }

   try {
      const decoded = jwt.verify(token as string, jwt_secret) as JWTPayload;

      const user = await prisma.user.findUnique({
         where: { id: decoded.userId },
         omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
            bio: true,
         },
      });
      if (!user) {
         return res.status(400).json({
            success: false,
            message: 'Unauthorized',
            error: 'User not found',
         });
      }

      req.user = user;

      next();
   } catch (error) {
      log(error);
      return res.status(400).json({
         success: false,
         message: 'Unauthorized',
         error: error instanceof Error ? error.message : 'Unknown error',
      });
   }
};
