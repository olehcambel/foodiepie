import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { jwtVerify } from '../common/jwt/jwt';
import { IS_PUBLIC_METADATA_KEY } from '../decorators/access.decorator';
import { USER_TYPE_METADATA_KEY } from '../decorators/user-type.decorator';

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();

    const isPublicRoute = handler && this.isPublic(handler);
    if (isPublicRoute) return true;

    const thisClass = context.getClass();
    if (isPublicRoute !== false && thisClass && this.isPublic(thisClass))
      return true;

    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException();
    }

    const { data } = jwtVerify(token);
    if (!data) {
      return false;
    }
    req.user = data;

    if (handler) return this.checkUserType(handler, data);
    if (thisClass) return this.checkUserType(handler, data);

    return true;
  }

  private checkUserType(handler: Function, user: JWTReq.TokenPayload): boolean {
    const userType = this.reflector.get(USER_TYPE_METADATA_KEY, handler);
    return userType && userType === user.type ? true : false;
  }

  private isPublic(ctx: Function): boolean | undefined {
    return this.reflector.get(IS_PUBLIC_METADATA_KEY, ctx);
  }
}
