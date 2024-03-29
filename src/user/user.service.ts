import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'core/entity/user.entity';
import { UserDto, UserVo } from 'core/models/user';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService
  ) {}

  async findOne(user: UserVo): Promise<UserEntity> {
    const findOneOptions = {
      email: user.email,
      password: crypto.createHmac('sha256', user.password).digest('hex')
    };

    return this.userRepository.findOne(findOneOptions);
  }

  async findById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = {
        User: ' not found'
      };
      throw new HttpException(
        {
          errors
        },
        401
      );
    }
    return this.buildUserDto(user);
  }

  public generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 1);
    const SECRET = this.configService.get<string>('SECURITY_JWT_SECRET');
    return jwt.sign(
      {
        id: user.id,
        exp: exp.getTime() / 1000
      },
      SECRET
    );
  }

  private buildUserDto(user: UserEntity) {
    const userDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image
    };

    return userDto;
  }
}
