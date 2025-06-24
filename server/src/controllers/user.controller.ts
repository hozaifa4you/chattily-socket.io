import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';

const findUsers = async (req: Request, res: Response) => {
   const search = req.query.search as string;

   if (!search) {
      const users = await prisma.user.findMany({
         take: 10,
         select: { id: true, fullName: true, profilePic: true, email: true },
      });

      return res.status(200).json(users);
   }

   const users = await prisma.user.findMany({
      where: {
         OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
         ],
      },
      take: 10,
      select: { id: true, fullName: true, profilePic: true, email: true },
   });

   return res.status(200).json(users);
};

const getConnectedUsers = async (req: Request, res: Response) => {
   const auth = req.user;
   if (!auth) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
   }

   // Step 1: Get all related messages
   const messages = await prisma.message.findMany({
      where: {
         OR: [{ senderId: auth.id }, { receiverId: auth.id }],
      },
      select: {
         senderId: true,
         receiverId: true,
         seen: true,
      },
   });

   const connectedUserIds = new Set<string>();
   const unseenMap = new Map<string, number>();

   for (const msg of messages) {
      const otherUserId =
         msg.senderId === auth.id ? msg.receiverId : msg.senderId;
      connectedUserIds.add(otherUserId);

      // If the message was sent TO me and is unseen, count it
      if (msg.receiverId === auth.id && !msg.seen) {
         unseenMap.set(msg.senderId, (unseenMap.get(msg.senderId) || 0) + 1);
      }
   }

   const users = await prisma.user.findMany({
      where: {
         id: { in: Array.from(connectedUserIds) },
      },
      select: {
         id: true,
         fullName: true,
         profilePic: true,
      },
   });

   const result = users.map((user) => ({
      user,
      unseenCount: unseenMap.get(user.id) || 0,
   }));

   return result;
};

export { findUsers, getConnectedUsers };
