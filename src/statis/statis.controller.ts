import {
  Controller
} from '@nestjs/common';
import { StatisService } from './statis.service';

@Controller('statis')
export class StatisController {
  constructor(private readonly statisService: StatisService) {}
}
