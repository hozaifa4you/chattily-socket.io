import { signin, signup } from '@/controllers/user.controller';
import express, { RequestHandler, type Router } from 'express';

const authRoutes: Router = express.Router();

authRoutes.post('/login', signin as unknown as RequestHandler);
authRoutes.post('/register', signup as unknown as RequestHandler);

authRoutes.get('/ping-pong', (_req, res) => {
   res.send('Pinkg pong');
});

export { authRoutes };
