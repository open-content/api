import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Like, Not } from 'typeorm';

import { JwtGuard } from '../jwt.guard';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private category: CategoryService) {}

  @UseGuards(JwtGuard)
  @Get()
  async all(@Req() req: Request) {
    const filter: any = {};

    if (req.query.q) {
      filter.name = Like(`%${req.query.q}%`);
    }

    if (req.query.by) {
      if (req.query.by === 'me') {
        filter.createdBy = req.user['id'];
      } else if (req.query.by === 'others') {
        filter.createdBy = Not(req.user['id']);
      }
    }

    return this.category.find(filter);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async one(@Req() req: Request) {
    return this.category.findById(req.params.id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: Request) {
    return this.category.create({ ...req.body, createdBy: req.user['id'] });
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(@Req() req: Request) {
    return this.category.update(req.params.id, req.body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Req() req: Request) {
    return this.category.delete(req.params.id);
  }
}
