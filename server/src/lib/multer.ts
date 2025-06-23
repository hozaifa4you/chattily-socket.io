import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';

export const uploadPath = path.join(process.cwd(), 'public', 'uploads');

const storage = multer.diskStorage({
   destination: (_req, _file, cb) => {
      if (!fs.existsSync(uploadPath)) {
         fs.mkdirSync(uploadPath);
      }

      cb(null, uploadPath);
   },
   filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const timestamp = Date.now();
      const sanitizedBase = baseName.replace(/\s+/g, '_').toLowerCase();
      cb(null, `${sanitizedBase}-${timestamp}${ext}`);
   },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (
   _req: Request,
   file: Express.Multer.File,
   cb: FileFilterCallback,
): void => {
   if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
   }
};

// Advanced multer config
export const upload = multer({
   storage,
   fileFilter,
   limits: {
      fileSize: 500 * 1024,
   },
});
