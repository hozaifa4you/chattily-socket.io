import { log } from 'console';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { frontend_url } from './config/env';
import http from 'http';
import path from 'path';
import { authRoutes } from './routes/auth.route';

const app = express();
const server = http.createServer(app);

const middlewares = [
   morgan('dev'),
   cors({
      origin: frontend_url,
      credentials: true,
   }),
   express.json({ limit: '4mb' }),
   express.urlencoded({ extended: false }),
];
app.use(middlewares);
app.use('/public', express.static(path.join(process.cwd(), '/public')));

app.get('/', (_req: Request, res: Response) => {
   res.send('Server is running...');
});

app.use('/api/v1/auth', authRoutes);

server.listen(process.env.PORT ?? 3030, () => {
   log(`Server is running on port ${process.env.PORT ?? 3030}`);
});
