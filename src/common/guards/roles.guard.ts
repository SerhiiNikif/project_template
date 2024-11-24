import { UserRole } from '@/common/constants';
import { ROLES_KEY } from '../decorators/roles-auth.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const staff = req.staff;

    if (!staff || !staff.role) {
      throw new ForbiddenException('User role not found.');
    }

    const hasRole = requiredRoles.some((role) => staff.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource'
      );
    }

    return true;
  }
}
