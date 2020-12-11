import {
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtGuard } from '../jwt.guard';

import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private media: MediaService) {}

  @UseGuards(JwtGuard)
  @Post('/upload')
  @UseInterceptors(AnyFilesInterceptor())
  upload(@UploadedFiles() files, @Req() req: Request) {
    return this.media.create(files, req.user);
  }

  @UseGuards(JwtGuard)
  @Post('/copy')
  copy(@Req() req: Request) {
    return this.media.copy(req.body, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  all(@Req() req: Request) {
    const filter: any = {};
    return this.media.find(filter);
  }

  @UseGuards(JwtGuard)
  @Get('/search')
  provider(@Req() req: Request) {
    return this.media.search(req.query.keyword, req.query.page);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  one(@Req() req: Request) {
    return this.media.findById(req.params.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Req() req: Request) {
    return this.media.delete(req.params.id, req.user);
  }
}
