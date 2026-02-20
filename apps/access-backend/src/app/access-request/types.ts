import { Request } from 'express';
import { Employee } from '../../../prisma/generated/client';

export interface IAuthorizedRequest extends Request {
  user: Employee;
}
