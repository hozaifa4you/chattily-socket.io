import { backend_url, jwt_expires_in, jwt_secret } from '@/config/env';
import jwt from 'jsonwebtoken';
import { type StringValue } from 'ms';

type FileType = 'avatar';

const generateToken = async (userId: string) => {
   const token = jwt.sign({ userId }, jwt_secret, {
      expiresIn: jwt_expires_in as StringValue,
   });

   return token;
};

const getUrlPath = (fileName: string, fileType: FileType) => {
   switch (fileType) {
      case 'avatar':
         return `${backend_url}/public/uploads/avatar/${fileName}`;

      default:
         return backend_url;
   }
};

export { generateToken, getUrlPath };
