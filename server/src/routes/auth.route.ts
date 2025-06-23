import { signin, signout, signup } from '@/controllers/auth.controller';
import express, { RequestHandler, type Router } from 'express';

const authRoutes: Router = express.Router();

authRoutes.post('/login', signin as unknown as RequestHandler);
authRoutes.post('/register', signup as unknown as RequestHandler);
authRoutes.delete('/logout', signout as unknown as RequestHandler);

export { authRoutes };
