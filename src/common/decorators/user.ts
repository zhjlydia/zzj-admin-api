import {
  createParamDecorator,
  HttpException,
  HttpStatus
} from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  const reqData = req.args[0];
  if (!!reqData.$current) {
    return !!data ? reqData.$current[data] : reqData.$current;
  } else {
    throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
  }
});
