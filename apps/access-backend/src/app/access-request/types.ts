import { Request } from 'express';
import { Role } from '../../../prisma/generated/client';

export interface IAuthorizedRequest extends Request {
  user: {
    id: string;
    role: Role;
  };
}
