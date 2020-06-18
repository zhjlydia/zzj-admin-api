import { SECRET } from '@/core/constants/secret';
import { UserRO } from '@/core/interface/user';
import { UserService } from '@/user/user.service';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      $current?: UserRO;
    }
  }
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      const decoded: any = jwt.verify(token, SECRET);
      const user = await this.userService.findById(decoded.id);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }
      req.$current = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
