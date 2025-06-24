import { authCheck, signin, signup } from '@/controllers/auth.controller';
import { auth } from '@/middleware/auth.middleware';
import express, { RequestHandler, type Router } from 'express';

const authRoutes: Router = express.Router();

authRoutes.post('/login', signin as unknown as RequestHandler);
authRoutes.post('/register', signup as unknown as RequestHandler);
authRoutes.patch(
   '/auth-check',
   auth as unknown as RequestHandler,
   authCheck as unknown as RequestHandler,
);

export { authRoutes };
