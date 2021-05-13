import { User } from '@/common/decorators/user';
import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { UserDto } from 'core/models/user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMe(@User('id') id: number): Promise<UserDto> {
    return await this.userService.findById(id);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ): Promise<string> {
    const user = await this.userService.findOne({ email, password });

    const errors = {
      User: ' not found'
    };
    if (!user) {
      throw new HttpException(
        {
          errors
        },
        401
      );
    }

    const token = await this.userService.generateJWT(user);
    return token;
  }
}
