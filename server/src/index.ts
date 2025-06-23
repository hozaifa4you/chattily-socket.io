import { log } from 'console';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { frontend_url } from './config/env';
import http from 'http';

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

server.listen(process.env.PORT ?? 3030, () => {
   log(`Server is running on port ${process.env.PORT ?? 3030}`);
});
