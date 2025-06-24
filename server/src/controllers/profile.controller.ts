import { prisma } from '@/lib/prisma';
import { log } from 'console';
import { type Request, type Response } from 'express';
import { z } from 'zod';
import { unlink } from 'fs/promises';
import path from 'path';

export const getProfile = async (req: Request, res: Response) => {
   const user = req.user;
   if (!user) {
      return res.status(402);
   }

   try {
      const dbUser = await prisma.user.findUnique({
         where: { id: user.id },
         omit: { password: true },
      });

      if (!dbUser) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
            error: 'User not present in the database',
         });
      }

      return res.status(200).json(dbUser);
   } catch (error) {
      log(error);
      return res.status(400).json({
         success: false,
         message: 'Something went wrong',
         error: error instanceof Error ? error.message : 'unknown error',
      });
   }
};

export const updateProfile = async (req: Request, res: Response) => {
   const userId = req.user?.id as string;
   const body = req.body;

   try {
      const { success, data } = await z
         .object({
            fullName: z.string().optional(),
            bio: z.string().max(90),
            profilePic: z.string().optional(),
         })
         .safeParseAsync(body);

      if (!success) {
         return res.status(400).json({
            success: false,
            message: 'Invalid input type',
            error: 'Validation error',
         });
      }

      const existingUser = await prisma.user.findUnique({
         where: { id: userId },
      });
      if (!existingUser) {
         return res.status(404).json({
            success: false,
            message: 'User not found',
            error: 'User does not exist in the database',
         });
      }

      if (
         existingUser.profilePic &&
         data.profilePic &&
         existingUser.profilePic !== data.profilePic
      ) {
         try {
            const filename = path.basename(existingUser.profilePic);

            const filePath = path.resolve(
               process.cwd(),
               'public',
               'uploads',
               'avatars',
               filename,
            );
            await unlink(filePath);
         } catch (err) {
            log('Failed to remove old profile picture:', err);
         }
      }

      const user = await prisma.user.update({
         where: { id: userId },
         data,
         omit: { password: true, createdAt: true, updatedAt: true, bio: true },
      });

      return res.status(200).json(user);
   } catch (error) {
      log(error);
      return res.status(400).json({
         success: false,
         message: 'Something went wrong',
         error: error instanceof Error ? error.message : 'unknown error',
      });
   }
};
