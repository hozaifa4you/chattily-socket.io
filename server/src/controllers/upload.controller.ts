import { getUrlPath } from '@/lib/utils';
import { Request, Response } from 'express';

export const avatarUploader = (req: Request, res: Response) => {
   const filename = req.file?.filename;
   if (!filename) {
      return res
         .status(500)
         .json({ success: false, message: 'File not found' });
   }

   const fileUrl = getUrlPath(filename, 'avatars');

   res.status(201).json({ avatar: filename, avatarUrl: fileUrl });
};
