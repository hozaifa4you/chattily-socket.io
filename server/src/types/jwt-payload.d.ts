import { JwtPayload } from 'jsonwebtoken';

type JWTPayload = JwtPayload & { userId: string };

type VerifiedUser = {
   id: string;
   email: string;
   fullName: string;
   profilePic: string | null;
};
