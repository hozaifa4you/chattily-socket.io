import 'dotenv/config';
import { log } from 'console';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { frontend_url, port } from '@/config/env';
import http from 'http';
import path from 'path';
import { authRoutes } from '@/routes/auth.route';
import { uploadRouter } from '@/routes/upload.route';
import { profileRoutes } from '@/routes/profile.route';
import { messageRoutes } from '@/routes/message.route';
import { userRoutes } from '@/routes/user.route';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
   cors: { origin: frontend_url, credentials: true },
});

// store online sockets
export const userSocketMap: Record<string, string> = {};

io.on('connection', (socket) => {
   const userId = socket.handshake.query.userId as string;

   log('User connected: ', userId);

   if (userId) {
      userSocketMap[userId] = socket.id;
   }

   io.emit('getOnlineUsers', Object.keys(userSocketMap));

   socket.on('disconnect', () => {
      log('User disconnected: ', userId);
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
   });
});

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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/messages', messageRoutes);

server.listen(process.env.PORT ?? 3030, () => {
   log(`Server is running on port ${port}`);
});
