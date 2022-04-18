import { Body, Controller, Delete, Get, Param, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  // === FILES === //
  @Post('/images')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: './uploadedFiles/images', filename: (req, file, cb) => {cb(null, Date.now() + '_' + file.originalname)}})}))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return "images/" + file.filename;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async hello(@Request() req){
    return req.user
  }
}
