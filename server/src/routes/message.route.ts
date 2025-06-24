import {
   getMessages,
   markMessageSeen,
   sendMessage,
} from '@/controllers/message.controller';
import { uploader } from '@/lib/multer';
import { auth } from '@/middleware/auth.middleware';
import express, { RequestHandler, type Router } from 'express';

const messageRoutes: Router = express.Router();

messageRoutes.get(
   '/:targetId',
   auth as unknown as RequestHandler,
   getMessages as unknown as RequestHandler,
);
messageRoutes.post(
   '/:targetId',
   auth as unknown as RequestHandler,
   uploader('messages').single('messages'),
   sendMessage as unknown as RequestHandler,
);

messageRoutes.patch(
   '/mark/:id',
   auth as unknown as RequestHandler,
   markMessageSeen as unknown as RequestHandler,
);

export { messageRoutes };
