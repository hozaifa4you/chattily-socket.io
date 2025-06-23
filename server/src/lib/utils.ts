import { jwt_expires_in, jwt_secret } from '@/config/env';
import jwt from 'jsonwebtoken';
import { type StringValue } from 'ms';

const generateToken = async (userId: string) => {
   const token = jwt.sign({ userId }, jwt_secret, {
      expiresIn: jwt_expires_in as StringValue,
   });

   return token;
};

export { generateToken };
