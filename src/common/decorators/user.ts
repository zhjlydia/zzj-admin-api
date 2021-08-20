import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  return !!data ? req.$current[data] : req.$current;
});
