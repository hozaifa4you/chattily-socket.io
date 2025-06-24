import { findUsers, getConnectedUsers } from '@/controllers/user.controller';
import { auth } from '@/middleware/auth.middleware';
import express, { RequestHandler, Router } from 'express';

const userRoutes: Router = express.Router();

userRoutes
   .route('/')
   .all(auth as unknown as RequestHandler)
   .get(findUsers as unknown as RequestHandler);

userRoutes
   .route('/connected-users')
   .all(auth as unknown as RequestHandler)
   .get(getConnectedUsers as unknown as RequestHandler);

export { userRoutes };
