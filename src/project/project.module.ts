import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from 'src/models/project.entity';
import { Post } from 'src/models/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Post])],
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
