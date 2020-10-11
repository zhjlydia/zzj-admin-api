import { OssService } from '@/common/services/oss';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import dayjs from 'dayjs';
import nanoid from 'nanoid/generate';
import path from 'path';
const dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Controller('share')
export class ShareController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Body('folderName') folderName: string): Promise<string> {
    const name = nanoid(dict, 12);
    const ext = path.extname(file.originalname);
    const filename = `${dayjs().format('YYYYMMDDHHmmssms')}-${name + ext}`;
    return this.ossService.put(filename, file.buffer, folderName + '/');
  }
}
