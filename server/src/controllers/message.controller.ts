import { prisma } from '@/lib/prisma';
import { log } from 'console';
import { Request, Response } from 'express';
import { z } from 'zod';
import { io, userSocketMap } from '@/index';

const getMessages = async (req: Request, res: Response) => {
   const auth = req.user;
   const targetId = req.params.targetId;
   if (!auth) return res.status(401);

   const messages = await prisma.message.findMany({
      where: {
         OR: [
            { senderId: auth.id, receiverId: targetId },
            { senderId: targetId, receiverId: auth.id },
         ],
      },
      include: {
         Receiver: {
            select: { id: true, fullName: true, profilePic: true, email: true },
         },
         Sender: {
            select: { id: true, fullName: true, profilePic: true, email: true },
         },
      },
   });

   await prisma.message.updateMany({
      where: { senderId: targetId, receiverId: auth.id },
      data: { seen: true },
   });

   return res.status(200).json(messages);
};

const markMessageSeen = async (req: Request, res: Response) => {
   try {
      const messageId = req.params.id;

      await prisma.message.update({
         where: { id: messageId },
         data: { seen: true },
      });

      return res.status(200).json({ success: true });
   } catch (error) {
      log(error);
      return res
         .status(400)
         .json({ success: false, message: 'Could not update message' });
   }
};

const sendMessage = async (req: Request, res: Response) => {
   const auth = req.user;
   const targetId = req.params.targetId;
   if (!auth) return res.status(401);

   const messageSchema = z
      .object({
         text: z.string().optional(),
         file: z.string().optional(),
      })
      .refine((data) => data.text || data.file, {
         message: 'Either text or file must be provided',
      });

   const text = req.body.text;
   const file = req.file?.filename;

   const parseResult = messageSchema.safeParse({ text, file });
   if (!parseResult.success) {
      return res.status(400).json({
         success: false,
         message: parseResult.error.errors[0].message,
      });
   }

   try {
      const targetUser = await prisma.user.findUnique({
         where: { id: targetId },
      });
      if (!targetUser) {
         return res
            .status(404)
            .json({ success: false, message: 'Targeted user not found' });
      }

      const message = await prisma.message.create({
         data: {
            text,
            image: file,
            senderId: auth.id,
            receiverId: targetId,
         },
      });

      // using socket
      const receiverSocketId = userSocketMap[targetId];
      if (receiverSocketId) {
         io.to(receiverSocketId).emit('newMessage', message);
      }

      return res.status(200).json(message);
   } catch (error) {
      log(error);
      return res
         .status(400)
         .json({ success: false, message: 'Could not update message' });
   }
};

export { getMessages, markMessageSeen, sendMessage };
