import { avatarUploader } from '@/controllers/upload.controller';
import { upload } from '@/lib/multer';
import express, { type Router, RequestHandler } from 'express';

const uploadRouter: Router = express.Router();

uploadRouter.post(
   '/avatar',
   upload.single('avatar'),
   avatarUploader as unknown as RequestHandler,
);

export { uploadRouter };
