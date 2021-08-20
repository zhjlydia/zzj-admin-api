import { UserService } from '@/user/user.service';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'core/models/user';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      $current?: UserDto;
    }
  }
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
    let token = '';
    const matches = (authHeaders as string).split(' ');
    if (matches && matches[0] === 'Bearer') {
      token = matches[1];
    }
    if (token) {
      try {
        const SECRET = this.configService.get<string>('SECURITY_JWT_SECRET');
        const decoded: Record<string, any> = jwt.verify(token, SECRET);
        const user = await this.userService.findById(decoded.id);
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }
        req.$current = user;
        next();
      } catch (e) {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
