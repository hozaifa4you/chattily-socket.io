import { User } from '@/generated/prisma';
import { JwtPayload } from 'jsonwebtoken';

type JWTPayload = JwtPayload & { userId: string };

type VerifiedUser = Omit<
   User,
   'password' | 'createdAt' | 'updatedAt' | 'bio' | 'profilePic'
>;
