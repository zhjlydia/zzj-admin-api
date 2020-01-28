import { SECRET } from '@/core/constants/secret';
import { LoginUserDto } from '@/core/dto/user';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { UserEntity } from 'entity/user.entity';
import { Repository } from 'typeorm';
const jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findOne(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex')
    };

    return await this.userRepository.findOne(findOneOptions);
  }
  async findById(id: number) {
    const user = this.userRepository.findOne(id);
    if (!user) {
      const error = { User: 'not found' };
      throw new HttpException({ error }, 401);
    }
    return user;
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        exp: exp.getTime() / 1000
      },
      SECRET
    );
  }
}
