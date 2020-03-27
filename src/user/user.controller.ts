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
    const user = await this.userService.findOne(loginUserDto);

    const errors = { User: ' not found' };
    if (!user) {
      throw new HttpException({ errors }, 401);
    }

    const token = await this.userService.generateJWT(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        image: user.image
      },
      token
    };
  }
}
