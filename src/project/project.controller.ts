import { User } from '@/common/decorators/user';
import { OssService } from '@/common/services/oss';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectEntity } from 'core/entity/project.entity';
import { PaginationData } from 'core/models/common';
import { ProjectVo } from 'core/models/project';
import dayjs from 'dayjs';
import nanoid from 'nanoid/generate';
import path from 'path';
import { DeleteResult } from 'typeorm';
import { ProjectService } from './project.service';
const dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService, private readonly ossService: OssService) {}

  @Get('all')
  async findAll(
    @Query('index') index: number,
    @Query('size') size: number
  ): Promise<PaginationData<ProjectEntity>> {
    return await this.projectService.findAll(Number(index) || 0, Number(size));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProjectEntity> {
    return await this.projectService.findOne(id);
  }

  @Post()
  async create(@User('id') userId: number, @Body() project: ProjectVo) {
    return this.projectService.create(userId, project);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() project: ProjectVo
  ): Promise<number> {
    return this.projectService.update(id, project);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.projectService.delete(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file): Promise<string> {
    const name = nanoid(dict, 12);
    const ext = path.extname(file.originalname);
    const filename = `${dayjs().format('YYYYMMDDHHmmssms')}-${name + ext}`;
    return this.ossService.put(filename, file.buffer, 'blog/projects/');
  }
}
