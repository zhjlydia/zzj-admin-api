import { SECRET } from '@/common/secret';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto, UserVo } from 'core/models/user';
import * as crypto from 'crypto';
import { UserEntity } from 'entity/user.entity';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findOne(user: UserVo): Promise<UserEntity> {
    const findOneOptions = {
      email: user.email,
      password: crypto.createHmac('sha256', user.password).digest('hex')
    };

    return await this.userRepository.findOne(findOneOptions);
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
