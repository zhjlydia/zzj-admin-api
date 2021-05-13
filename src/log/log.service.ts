import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from 'entity/log.entity';
import { Between, getRepository, Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>
  ) {}

  async getPv(begin: Date, end: Date) {
    const count = await this.logRepository.count({
      createdAt: Between(begin, end)
    });
    return count;
  }

  async getUv(begin: Date, end: Date) {
    const count = await getRepository(LogEntity)
      .createQueryBuilder('log')
      .select('COUNT(*)', 'count')
      .where('log.createdAt >=:begin and log.createdAt <=:end', { begin, end })
      .groupBy('log.ip')
      .getRawMany();
    return count.length;
  }
}
