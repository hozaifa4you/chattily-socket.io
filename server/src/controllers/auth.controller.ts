import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { log } from 'console';
import { generateToken } from '@/lib/utils';

const signup = async (req: Request, res: Response) => {
   const body = req.body;

   try {
      const { success, data, error } = await z
         .object({
            fullName: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(6),
            bio: z.string().optional(),
         })
         .safeParseAsync(body);

      if (!success) {
         return res.status(400).json({
            success: false,
            message: 'Invalid request data',
            error:
               error?.issues.map((issue) => issue.message).join(', ') ||
               'Unknown error',
         });
      }

      const existingUser = await prisma.user.findUnique({
         where: {
            email: data.email,
         },
      });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: 'User with this email already exists',
         });
      }

      const hashPass = await hash(data.password);

      const user = await prisma.user.create({
         data: {
            ...data,
            password: hashPass,
         },
         omit: {
            password: true,
         },
      });

      const token = generateToken(user.id);

      return res.status(201).json({
         success: true,
         user,
         token,
      });
   } catch (error) {
      log(error);
      return res.status(400).json({
         success: false,
         message: 'Invalid request data',
         error: error instanceof Error ? error.message : 'Unknown error',
      });
   }
};

const signin = async (req: Request, res: Response) => {
   try {
      const body = req.body;

      const { success, data, error } = await z
         .object({
            email: z.string().email(),
            password: z.string().min(6),
         })
         .safeParseAsync(body);

      if (!success) {
         return res.status(400).json({
            success: false,
            message: 'Invalid request data',
            error:
               error?.issues.map((issue) => issue.message).join(', ') ||
               'Unknown error',
         });
      }

      const user = await prisma.user.findUnique({
         where: { email: data.email },
      });
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'Invalid credentials',
         });
      }

      const isMatched = await verify(user.password, data.password);
      if (!isMatched) {
         return res.status(404).json({
            success: false,
            message: 'Invalid credentials',
         });
      }

      const token = generateToken(user.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;

      return res
         .status(200)
         .json({ token, user: rest, message: 'Login successful' });
   } catch (error) {
      log(error);
      return res.status(400).json({
         success: false,
         message: 'Invalid request data',
         error: error instanceof Error ? error.message : 'Unknown error',
      });
   }
};

const authCheck = async (req: Request, res: Response) => {
   const auth = req.user;

   if (!auth) {
      return res.status(401).json({
         success: false,
         message: 'Unauthorized',
      });
   }

   return res.status(200).json({ user: auth, success: true });
};

export { signup, signin, authCheck };
