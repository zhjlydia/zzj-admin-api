import { LoginUserDto } from '@/core/dto/user';
import { UserWhthToken } from '@/core/interface/user';
import {
  Body,
  Controller,
  HttpException,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(
    @Body('user') loginUserDto: LoginUserDto
  ): Promise<UserWhthToken> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(_user);
    const { id, email, username, image } = _user;
    const user = { id, email, username, image };
    return { user, token };
  }
}
