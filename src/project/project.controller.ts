import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
    constructor( private readonly projectService: ProjectService ) {}

    @Get('/')
    async getProjects(@Query() query) {
        //await new Promise(r => setTimeout(r, 500));
        return this.projectService.getProjects(query);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createProject(@Body() body) {
        return this.projectService.createProject(body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:safe_name')
    async deleteProject(@Param('safe_name') safe_name) {
        return this.projectService.deleteProject(safe_name);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:safe_name')
    async updateProject(@Param('safe_name') safe_name, @Body() body) {
        return this.projectService.updateProject(body);
    }

    // --- POSTS
    @Get('/:safe_name/posts')
    async getProjectPosts(@Param('safe_name') safe_name) {
        return this.projectService.getProjectPosts(safe_name);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/:safe_name/posts')
    async createProjectPost(@Param('safe_name') safe_name, @Body() body, @Request() req) {
        console.log(req.user)
        return this.projectService.createProjectPost(safe_name, body, req.user);
    }

}
