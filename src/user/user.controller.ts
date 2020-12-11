import {
  Controller,
  Delete,
  Get,
  Put,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Like, Not, Raw, ObjectID } from 'typeorm';

import { JwtGuard } from '../jwt.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private user: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  async all(@Req() req: Request): Promise<any> {
    const filter: any = {
      email: {
        $ne: req.user['email']
      },
    };

    // if (req.query.q) {
    //   filter.firstName = Raw(
    //     `"firstName" AND ("firstName" LIKE '%${req.query.q}%' OR "lastName" LIKE '%${req.query.q}%' OR "email" LIKE '%${req.query.q}%')`,
    //   );
    // }

    if (req.query.type) {
      if (req.query.type === 'active') {
        filter.status = true;
      } else if (req.query.type === 'inactive') {
        filter.status = false;
      } else if (req.query.type === 'admin') {
        filter.role = 'admin';
      } else if (req.query.type === 'user') {
        filter.role = 'user';
      }
    }

    return this.user.find(filter);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async one(@Req() req: Request) {
    return this.user.findById(req.params.id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: Request) {
    return this.user.create(req.body);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(@Req() req: Request) {
    return this.user.update(req.params.id, req.body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Req() req: Request) {
    return this.user.delete(req.params.id);
  }
}