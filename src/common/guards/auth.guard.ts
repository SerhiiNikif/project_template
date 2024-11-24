import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Request as ExpressRequest } from 'express';
import { User } from '@/models/users/entities/user.entity';

interface RequestWithUser extends ExpressRequest {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('No JWT found in cookies');
    }

    try {
      const user = await this.authService.verifyToken(token); // Verify the token and get the user
      if (!user) {
          throw new UnauthorizedException('Invalid or expired token');
      }
      request.user = user; // Attach user to the request for further use
      return true;
  } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
  }
  }
}
