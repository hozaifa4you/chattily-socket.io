import { VerifiedUser } from './jwt-payload';

declare global {
   namespace Express {
      export interface Request {
         user?: VerifiedUser;
      }
   }
}
