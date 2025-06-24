import { avatarUploader } from '@/controllers/upload.controller';
import { uploader } from '@/lib/multer';
import { auth } from '@/middleware/auth.middleware';
import express, { type Router, RequestHandler } from 'express';

const uploadRouter: Router = express.Router();

uploadRouter.post(
   '/avatar',
   auth as unknown as RequestHandler,
   uploader('avatars').single('avatar'),
   avatarUploader as unknown as RequestHandler,
);

export { uploadRouter };
