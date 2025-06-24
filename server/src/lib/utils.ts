import { backend_url, jwt_expires_in, jwt_secret } from '@/config/env';
import jwt from 'jsonwebtoken';
import { type StringValue } from 'ms';

export type FileType = 'avatars' | 'messages';

const generateToken = (userId: string) => {
   const token = jwt.sign({ userId }, jwt_secret, {
      expiresIn: jwt_expires_in as StringValue,
   });

   return token;
};

const getUrlPath = (fileName: string, fileType: FileType) => {
   return `${backend_url}/public/uploads/${fileType}/${fileName}`;
};

export { generateToken, getUrlPath };
