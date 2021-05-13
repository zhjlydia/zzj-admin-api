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
  Query
} from '@nestjs/common';
import { ProjectVo } from 'core/models/project';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly ossService: OssService
  ) {}

  @Get('all')
  async findAll(@Query('index') index: number, @Query('size') size: number) {
    return this.projectService.findAll(Number(index) || 0, Number(size));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Post()
  async create(@User('id') userId: number, @Body() project: ProjectVo) {
    return this.projectService.create(userId, project);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() project: ProjectVo) {
    return this.projectService.update(id, project);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.projectService.delete(id);
  }
}
