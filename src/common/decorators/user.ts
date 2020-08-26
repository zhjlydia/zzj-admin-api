import { createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../secret';

export const User = createParamDecorator((data, req) => {
  if (!!req.$current) {
    return !!data ? req.$current[data] : req.$current;
  }
  const authHeaders = req.headers.authorization;
  let token = '';
  if (authHeaders) {
    token = (authHeaders as string).split(' ')[1];
  }
  if (token) {
    const decoded: any = jwt.verify(token, SECRET);
    return !!data ? decoded[data] : decoded.user;
  }
});
