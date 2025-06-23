import { getProfile, updateProfile } from '@/controllers/profile.controller';
import { auth } from '@/middleware/auth.middleware';
import express, { RequestHandler, type Router } from 'express';

const profileRoutes: Router = express.Router();

profileRoutes
   .route('/')
   .get(
      auth as unknown as RequestHandler,
      getProfile as unknown as RequestHandler,
   )
   .put(
      auth as unknown as RequestHandler,
      updateProfile as unknown as RequestHandler,
   );

export { profileRoutes };
