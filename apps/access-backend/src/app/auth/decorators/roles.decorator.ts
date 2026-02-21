import { SetMetadata } from '@nestjs/common';
import { Role } from '@access/prisma';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
