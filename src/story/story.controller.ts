import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Like } from 'typeorm';
import { JwtGuard } from '../jwt.guard';

import { StoryService } from './story.service';

@Controller('stories')
export class StoryController {
  constructor(private story: StoryService) {}

  @UseGuards(JwtGuard)
  @Get()
  async all(@Req() req: Request) {
    const filter: any = {
      workspace: req.user['workspace']['id'],
    };

    if (req.query.q) {
      filter.title = Like(`%${req.query.q}%`);
    }

    if (req.query.status) {
      if (req.query.status === 'draft') {
        filter.status = 0;
      } else if (req.query.status === 'published') {
        filter.status = 1;
      }
    }

    return this.story.find(filter);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async one(@Req() req: Request) {
    return this.story.findById(req.params.id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: Request) {
    return this.story.create({
      ...req.body,
      author: req.user['id'],
      workspace: req.user['workspace']['id'],
    });
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(@Req() req: Request) {
    return this.story.update(req.params.id, req.body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Req() req: Request, @Res() res: Response) {
    await this.story.delete(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully.',
    });
  }
}
